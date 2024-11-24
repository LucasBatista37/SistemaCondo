<template>
  <div class="register-container">
    <h2>Cadastrar</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Usuário</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="email">E-mail</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <button type="submit" class="btn-register">Cadastrar</button>
      <div class="error" v-if="error">{{ error }}</div>
    </form>
    <p>Já tem uma conta? <a @click="goToLogin">Faça login</a></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Register",
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = 'As senhas não coincidem.';
        return;
      }

      try {
        const response = await axios.post('https://backend-condoview.onrender.com/api/users/register', {
          nome: this.username,
          email: this.email,
          senha: this.password,
          role: 'administrador', 
        });

        console.log('Usuário registrado com sucesso:', response.data);

        const token = response.data.token;
        localStorage.setItem('authToken', token);

        this.$router.push({ name: 'Dashboard3' });
      } catch (err) {
        console.error('Erro ao registrar usuário:', err.response?.data || err.message);
        this.error = err.response?.data.errors?.[0] || 'Erro ao registrar. Tente novamente mais tarde.';
      }
    },
    goToLogin() {
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>

<style scoped>
.register-container {
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

.btn-register {
  background-color: #6f42c1;
  color: white;
}

.btn-register:hover {
  background-color: #593c9a;
}

.error {
  color: #ff4d4d;
  margin-top: 15px;
  font-weight: bold;
}

p {
  margin-top: 20px;
  color: #ffffff;
}

a {
  color: #6f42c1;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>