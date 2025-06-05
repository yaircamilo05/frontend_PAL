<template>
  <div class="login-container">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin" v-if="showLoginForm">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>

    <hr v-if="showLoginForm" />

    <button @click="loginWithGoogle" v-if="showLoginForm">Iniciar sesión con Google</button>
    <button @click="loginWithGitHub" v-if="showLoginForm">Iniciar sesión con GitHub</button>

    <!-- Debug info (solo si showDebug es true) -->
    <div v-if="debugInfo && showDebug" style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; font-size: 12px;">
      <p><strong>🔍 Debug Info:</strong></p>
      <p>showLoginForm: {{ showLoginForm }}</p>
      <p>Token encontrado: {{ !!debugInfo.token }}</p>
      <p>Payload: {{ debugInfo.payload }}</p>
      <p>UserInfo: {{ debugInfo.userInfo }}</p>
      <p>Roles: {{ debugInfo.roles }}</p>
      <p>Redirección a: {{ debugInfo.redirectTo }}</p>
    </div>

    <p v-if="error" style="color: red; margin-top: 10px">{{ error }}</p>
  </div>
</template>

<script>
import api from '@/services/api';
import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      showLoginForm: true,
      debugInfo: null,
      showDebug: false // Cambiar a true solo para debug
    };
  },
  mounted() {
    this.handleOAuthCallback();
  },
  methods: {
    handleOAuthCallback() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        console.log('🎯 Token encontrado en URL:', token);

        try {
          const payload = jwtDecode(token);
          console.log('🔍 Payload decodificado:', payload);

          const userInfo = {
            id: payload.id,
            username: payload.sub,
            roles: payload.roles,
          };

          console.log('👤 UserInfo creado:', userInfo);
          console.log('🎭 Roles:', userInfo.roles);

          // Guardar en sessionStorage
          sessionStorage.setItem('jwt', token);
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          this.showLoginForm = false;

          // Debug info
          this.debugInfo = {
            token: !!token,
            payload: payload,
            userInfo: userInfo,
            roles: userInfo.roles,
            redirectTo: ''
          };

          let redirectPath = '/student/home';
          if (userInfo.roles.includes('ADMIN')) {
            redirectPath = '/admin/dashboard';
          } else if (userInfo.roles.includes('INSTRUCTOR')) {
            redirectPath = '/instructor/courses';
          } else if (userInfo.roles.includes('student')) {
            redirectPath = '/student/home';
          }

          this.debugInfo.redirectTo = redirectPath;

          console.log('🚀 Redirigiendo a:', redirectPath);

          window.history.replaceState({}, '', '/login');
          this.$router.push(redirectPath);

        } catch (err) {
          console.error('❌ Error al procesar token:', err);
          this.error = 'Error al procesar el token de autenticación.';
        }
      }
    },

    async handleLogin() {
      if (!this.username || !this.password) {
        return alert('Por favor, completa todos los campos.');
      }

      try {
        const { data } = await api.post('/login', {
          username: this.username,
          password: this.password,
        });

        const token = data.token;
        const payload = jwtDecode(token);

        const userInfo = {
          id: payload.id,
          username: payload.sub,
          roles: payload.roles,
        };

        sessionStorage.setItem('jwt', token);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (userInfo.roles.includes('ADMIN')) {
          this.$router.push('/admin/dashboard');
        } else if (userInfo.roles.includes('INSTRUCTOR')) {
          this.$router.push('/instructor/courses');
        } else {
          this.$router.push('/student/home');
        }

        alert('Inicio de sesión exitoso');
      } catch (err) {
        console.error(err);
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
    },

    loginWithGoogle() {
      console.log('🔄 Iniciando login con Google...');
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    },

    loginWithGitHub() {
      console.log('🔄 Iniciando login con GitHub...');
      window.location.href = 'http://localhost:8080/oauth2/authorization/github';
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

button:hover {
  background-color: #0056b3;
}

hr {
  margin: 20px 0;
}
</style>
