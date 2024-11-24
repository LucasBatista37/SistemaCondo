<template>
  <div class="dashboard" @click="handleClickOutside">
    <h1>
      Cadastro de Avisos
      <button class="btn-close" @click="closeForm">
        &times;
      </button>
    </h1>

    <div v-if="showForm" class="form-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="form-group">
          <label for="title">
            <i class="fas fa-pencil-alt"></i> Título
          </label>
          <input type="text" id="title" v-model="title" required />
        </div>

        <div class="form-group">
          <label for="message">
            <i class="fas fa-comment-dots"></i> Descrição
          </label>
          <textarea id="message" v-model="message" required></textarea>
        </div>

        <div class="form-group">
          <label for="icon">
            <i class="fas fa-icon"></i> Ícone
          </label>
          <select id="icon" v-model="selectedIcon" required>
            <option value="" disabled selected>Selecione um ícone</option>
            <option value="fas fa-bell">🔔 Notificação</option>
            <option value="fas fa-question-circle">❓ Informação</option>
            <option value="fas fa-exclamation-circle">⚠️ Alerta</option>
            <option value="fas fa-check-circle">✅ Sucesso</option>
          </select>
        </div>

        <button type="submit" class="btn-submit">
          <i class="fas fa-paper-plane"></i> Publicar Aviso
        </button>
      </form>
    </div>

    <div class="btn-container" v-if="!showForm">
      <button @click="showForm = true; showCard = false;" class="btn-add">
        <i class="fas fa-plus"></i> Adicionar Aviso
      </button>
    </div>

    <div class="card-container" v-if="showCard">
      <div class="card" v-for="notice in notices" :key="notice._id">
        <div class="card-header">
          <span class="card-title">{{ notice.title || 'Título do Aviso' }}</span>
          <div class="options-container">
            <button class="btn-options" :data-id="notice._id" @click="toggleOptions(notice._id)">
              ⋮
            </button>
            <div class="options-menu" :data-id="notice._id" v-if="showMenu[notice._id]">
              <button class="btn-edit" @click="openEditModal(notice)">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn-delete" @click="deleteNotice(notice._id)">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <span class="card-icon" :class="notice.icon"></span>
          <p>{{ notice.message || 'Descrição do aviso' }}</p>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Aviso</h2>
        <form @submit.prevent="saveEdit">
          <div class="form-group">
            <label for="edit-title">
              <i class="fas fa-pencil-alt"></i> Título
            </label>
            <input type="text" id="edit-title" v-model="title" required />
          </div>

          <div class="form-group">
            <label for="edit-message">
              <i class="fas fa-comment-dots"></i> Descrição
            </label>
            <textarea id="edit-message" v-model="message" required></textarea>
          </div>

          <div class="form-group">
            <label for="edit-icon">
              <i class="fas fa-icon"></i> Ícone
            </label>
            <select id="edit-icon" v-model="selectedIcon" required>
              <option value="" disabled selected>Selecione um ícone</option>
              <option value="fas fa-bell">🔔 Notificação</option>
              <option value="fas fa-question-circle">❓ Informação</option>
              <option value="fas fa-exclamation-circle">⚠️ Alerta</option>
              <option value="fas fa-check-circle">✅ Sucesso</option>
            </select>
          </div>

          <button type="submit" class="btn-submit">
            <i class="fas fa-save"></i> Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Dashboard1',
  data() {
    return {
      title: '',
      message: '',
      selectedIcon: '',
      showForm: false,
      showCard: true,
      showMenu: {},
      notices: [],
      showEditModal: false,
      editNoticeId: null
    };
  },
  methods: {
    async submitForm() {
      try {
        const newNotice = {
          title: this.title,
          message: this.message,
          date: new Date().toISOString(),
          icon: this.selectedIcon
        };
        const response = await axios.post('https://backend-condoview.onrender.com/api/users/admin/notices', newNotice);
        this.notices.push(response.data);
        this.showCard = true;
        this.showForm = false;
        this.title = '';
        this.message = '';
        this.selectedIcon = '';
        this.showMenu = {};
      } catch (error) {
        console.error("Erro ao criar aviso:", error);
        alert("Houve um erro ao criar o aviso.");
      }
    },
    async fetchNotices() {
      try {
        const response = await axios.get('https://backend-condoview.onrender.com/api/users/admin/notices');
        this.notices = response.data;
      } catch (error) {
        console.error("Erro ao obter avisos:", error);
      }
    },
    async deleteNotice(id) {
      try {
        await axios.delete(`https://backend-condoview.onrender.com/api/users/admin/notices/${id}`);
        this.notices = this.notices.filter(notice => notice._id !== id);
        console.log("Aviso deletado com sucesso.");
      } catch (error) {
        console.error("Erro ao deletar o aviso:", error);
      }
    },
    openEditModal(notice) {
      this.title = notice.title;
      this.message = notice.message;
      this.selectedIcon = notice.icon;
      this.editNoticeId = notice._id;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.title = '';
      this.message = '';
      this.selectedIcon = '';
      this.editNoticeId = null;
    },
    async saveEdit() {
      try {
        const updatedNotice = {
          title: this.title,
          message: this.message,
          date: new Date().toISOString(),
          icon: this.selectedIcon
        };
        const response = await axios.put(`https://backend-condoview.onrender.com/api/users/admin/notices/${this.editNoticeId}`, updatedNotice);
        const index = this.notices.findIndex(notice => notice._id === this.editNoticeId);
        if (index !== -1) {
          this.notices[index] = response.data;
        }
        this.closeEditModal();
      } catch (error) {
        console.error("Erro ao atualizar o aviso:", error);
      }
    },
    closeForm() {
      this.showForm = false;
      this.showCard = true;
    },
    toggleOptions(id) {
      this.$set(this.showMenu, id, !this.showMenu[id]);
    },
    handleClickOutside(event) {
      Object.keys(this.showMenu).forEach(id => {
        const menu = this.$el.querySelector(`.options-menu[data-id="${id}"]`);
        const button = this.$el.querySelector(`.btn-options[data-id="${id}"]`);
        if (this.showMenu[id] && menu && !menu.contains(event.target) && !button.contains(event.target)) {
          this.$set(this.showMenu, id, false);
        }
      });
    }
  },
  mounted() {
    this.fetchNotices();
  }
};
</script>

<style>
.dashboard {
  max-width: 800px;
  height: 700px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.btn-close {
  font-size: 24px;
  color: #000;
  border: none;
  background: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 5px;
}

.form-container {
  margin-bottom: 20px;
}

.btn-container {
  text-align: center;
}

.btn-add,
.btn-submit {
  display: inline-block;
  background-color: #6f42c1;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.btn-add:hover,
.btn-submit:hover {
  background-color: #593c9a;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

label i {
  margin-right: 8px;
  color: #007bff;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.btn-submit {
  margin-top: 10px;
}

.card-container {
  margin-top: 20px;
  max-height: 550px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #6f42c1 #f1f1f1;
}

.card-container::-webkit-scrollbar {
  width: 8px;
}

.card-container::-webkit-scrollbar-thumb {
  background-color: #6f42c1;
  border-radius: 10px;
}

.card-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.card {
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: bold;
  font-size: 18px;
}

.options-container {
  position: relative;
}

.btn-options {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #6f42c1;
}

.options-menu {
  position: absolute;
  right: 20px;
  top: -7px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 10px 0;
}

.options-menu button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
}

.options-menu button:hover {
  background-color: #f1f1f1;
}

.btn-edit {
  color: #007bff;
}

.btn-delete {
  color: #dc3545;
}

.card-body {
  margin-top: 10px;
}

.card-icon {
  font-size: 24px;
  margin-right: 10px;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #6f42c1 #f1f1f1;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: #6f42c1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}
</style>
