<template>
  <div class="dashboard" @click="handleClickOutside">
    <h1>
      Cadastro de Assembleias
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
          <label for="date">
            <i class="fas fa-calendar"></i> Data da Assembleia
          </label>
          <input type="datetime-local" id="date" v-model="date" required />
        </div>

        <div class="form-group">
          <label for="status">
            <i class="fas fa-info-circle"></i> Status
          </label>
          <select id="status" v-model="status" required>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Encerrada">Encerrada</option>
          </select>
        </div>

        <button type="submit" class="btn-submit">
          <i class="fas fa-paper-plane"></i> Publicar Assembleia
        </button>
      </form>
    </div>

    <div class="btn-container" v-if="!showForm">
      <button @click="showForm = true; showCard = false;" class="btn-add">
        <i class="fas fa-plus"></i> Adicionar Assembleia
      </button>
    </div>

    <div class="card-container" v-if="showCard">
      <div class="card" v-for="assembly in assemblies" :key="assembly._id">
        <div class="card-header">
          <span class="card-title">{{ assembly.title || 'Título da Assembleia' }}</span>
          <div class="options-container">
            <button class="btn-options" :data-id="assembly._id" @click="toggleOptions(assembly._id)">
              ⋮
            </button>
            <div class="options-menu" :data-id="assembly._id" v-if="showMenu[assembly._id]">
              <button class="btn-edit" @click="openEditModal(assembly)">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn-delete" @click="deleteAssembly(assembly._id)">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <p>{{ assembly.description || 'Descrição da assembleia' }}</p>
          <p><strong>Data:</strong> {{ new Date(assembly.date).toLocaleString() }}</p>
          <p><strong>Status:</strong> {{ assembly.status }}</p>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Assembleia</h2>
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
            <label for="edit-date">
              <i class="fas fa-calendar"></i> Data da Assembleia
            </label>
            <input type="datetime-local" id="edit-date" v-model="date" required />
          </div>

          <div class="form-group">
            <label for="edit-status">
              <i class="fas fa-info-circle"></i> Status
            </label>
            <select id="edit-status" v-model="status" required>
              <option value="Pendente">Pendente</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Encerrada">Encerrada</option>
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
      date: '',
      status: 'Pendente',
      showForm: false,
      showCard: true,
      showMenu: {},
      assemblies: [],
      showEditModal: false,
      editAssemblyId: null
    };
  },
  methods: {
    async submitForm() {
      try {
        const newAssembly = {
          title: this.title,
          description: this.message,
          date: this.date,
          status: this.status
        };
        const response = await axios.post('https://backend-condoview.onrender.com/api/users/assemblies', newAssembly);
        this.assemblies.push(response.data);
        this.showCard = true;
        this.showForm = false;
        this.title = '';
        this.message = '';
        this.date = '';
        this.status = 'Pendente';
        this.showMenu = {};
      } catch (error) {
        console.error("Erro ao criar assembleia:", error);
        alert("Houve um erro ao criar a assembleia.");
      }
    },
    async fetchAssemblies() {
      try {
        const response = await axios.get('https://backend-condoview.onrender.com/api/users/admin/assemblies');
        this.assemblies = response.data;
      } catch (error) {
        console.error("Erro ao obter assembleias:", error);
      }
    },
    async deleteAssembly(id) {
      try {
        await axios.delete(`https://backend-condoview.onrender.com/api/users/admin/assemblies/${id}`);
        this.assemblies = this.assemblies.filter(assembly => assembly._id !== id);
        console.log("Assembleia deletada com sucesso.");
      } catch (error) {
        console.error("Erro ao deletar a assembleia:", error);
      }
    },
    openEditModal(assembly) {
      this.title = assembly.title;
      this.message = assembly.description;
      this.date = assembly.date;
      this.status = assembly.status;
      this.editAssemblyId = assembly._id;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.title = '';
      this.message = '';
      this.date = '';
      this.status = 'Pendente';
      this.editAssemblyId = null;
    },
    async saveEdit() {
      try {
        const updatedAssembly = {
          title: this.title,
          description: this.message,
          date: this.date,
          status: this.status
        };
        const response = await axios.put(`https://backend-condoview.onrender.com/api/users/assemblies/${this.editAssemblyId}`, updatedAssembly);
        const index = this.assemblies.findIndex(assembly => assembly._id === this.editAssemblyId);
        if (index !== -1) {
          this.assemblies[index] = response.data;
        }
        this.closeEditModal();
      } catch (error) {
        console.error("Erro ao atualizar a assembleia:", error);
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
    this.fetchAssemblies();
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
    max-height: 559px;
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
