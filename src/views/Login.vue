<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn-login">Entrar</button>
      <button type="button" class="btn-register" @click="goToRegister">Cadastrar</button>
      <div class="error" v-if="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Login",
  data() {
    return {
      email: '', 
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('https://backend-condoview.onrender.com/api/users/login', {
          email: this.email,
          senha: this.password,
        });

        console.log('Login bem-sucedido:', response.data);

        const token = response.data.token;
        localStorage.setItem('authToken', token);

        this.$router.push({ name: 'SideBar' });
      } catch (err) {
        console.error('Erro no login:', err.response?.data || err.message);
        this.error = err.response?.data.errors?.[0] || 'Erro ao realizar login. Verifique suas credenciais.';
      }
    },
    goToRegister() {
      this.$router.push({ name: 'Register' });
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: auto;
  padding: 50px;
  background-color: #2c2c2c;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  text-align: center;
}

h2 {
  font-size: 2.5em;
  margin-bottom: 30px;
  color: #6f42c1;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #ffffff;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #6f42c1;
  border-radius: 6px;
  background-color: #3c3c3c;
  color: #ffffff;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #6f42c1;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 1em;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-login {
  background-color: #6f42c1;
  color: white;
}

.btn-login:hover {
  background-color: #593c9a;
}

.btn-register {
  background-color: #444;
  color: white;
}

.btn-register:hover {
  background-color: #555;
}

.error {
  color: #ff4d4d;
  margin-top: 15px;
  font-weight: bold;
}
</style>