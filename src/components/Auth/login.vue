<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
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
    };
  },
  methods: {
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
        // 1) Guardamos el token
        sessionStorage.setItem('jwt', token);
        // (Opcional) También configuras el header global de Axios:
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 2) Decodificamos el payload del JWT
        const payload = jwtDecode(token);
        // Ejemplo payload:
        // {
        //   sub: "yair",
        //   id: 26,
        //   roles: [{ id: 13, name: "INSTRUCTOR" }],
        //   iat: 1746719313,
        //   exp: 1746722913
        // }

        // 3) Guardamos la info de usuario y roles
        const userInfo = {
          id: payload.id,
          username: payload.sub,
          roles: payload.roles.map(r => r.name),  // ['INSTRUCTOR', ...]
        };
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

        // 4) Decidir rutas según roles
        if (userInfo.roles.includes('ADMIN')) {
          this.$router.push('/admin/dashboard');
        } else if (userInfo.roles.includes('INSTRUCTOR')) {
          this.$router.push('/instructor/courses');
        } else {
          this.$router.push('/student/courses');
        }

        alert('Inicio de sesión exitoso');

      } catch (err) {
        console.error(err);
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
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
}

button:hover {
    background-color: #0056b3;
}
</style>