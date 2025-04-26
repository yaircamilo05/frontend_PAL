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
import api from '@/services/api'; // Asegúrate de tener configurado tu cliente API

export default {
    data() {
        return {
            username: '', // Cambiado de email a username
            password: '',
        };
    },
    methods: {
        async handleLogin() {
            if (this.username && this.password) {
                try {
                    // Realiza la solicitud de inicio de sesión a la API
                    const response = await api.post('/login', {
                        username: this.username, // Cambiado de email a username
                        password: this.password,
                    });

                    // Guarda el token JWT en sessionStorage
                    const token = response.data.token;
                    sessionStorage.setItem('jwt', token);

                    // Opcional: Guarda información adicional del usuario si está disponible
                    const userInfo = response.data.user;
                    sessionStorage.setItem('user', JSON.stringify(userInfo));

                    alert('Inicio de sesión exitoso');
                    // Redirige al usuario a otra página si es necesario
                    this.$router.push('/dashboard');
                } catch (error) {
                    console.error('Error al iniciar sesión:', error);
                    alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
                }
            } else {
                alert('Por favor, completa todos los campos.');
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