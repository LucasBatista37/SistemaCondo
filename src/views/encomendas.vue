<template>
  <div class="dashboard">
    <h1>
      Cadastro de Encomendas
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
          <label for="apartment">
            <i class="fas fa-home"></i> Apartamento
          </label>
          <input type="text" id="apartment" v-model="apartment" required />
        </div>

        <div class="form-group">
          <label for="datetime">
            <i class="fas fa-calendar-alt"></i> Data e Hora
          </label>
          <input type="datetime-local" id="datetime" v-model="dateTime" required />
        </div>

        <div class="form-group">
          <label for="image">
            <i class="fas fa-image"></i> Imagem (opcional)
          </label>
          <input type="file" id="image" @change="handleImageUpload" />
        </div>

        <button type="submit" class="btn-submit">
          <i class="fas fa-paper-plane"></i> Publicar Encomenda
        </button>
      </form>
    </div>

    <div class="btn-container" v-if="!showForm">
      <button @click="showForm = true; showCard = false;" class="btn-add">
        <i class="fas fa-plus"></i> Adicionar Encomenda
      </button>
    </div>

    <div class="card-container" v-if="showCard">
      <div class="card" v-for="pkg in packages" :key="pkg._id">
        <div class="card-header">
          <span class="card-title">{{ pkg.title || 'Título da Encomenda' }}</span>
          <div class="options-container">
            <button class="btn-options" @click="toggleOptions(pkg._id)">
              ⋮
            </button>
            <div v-if="showMenu[pkg._id]" class="options-menu">
              <button class="btn-edit" @click="openEditModal(pkg)">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn-delete" @click="deletePackage(pkg._id)">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <p><strong>Apartamento:</strong> {{ pkg.apartment || 'N/A' }}</p>
          <p style="margin-top: 10px;"><strong>Data e Hora:</strong> {{ pkg.time || 'N/A' }}</p>
          <img v-if="pkg.imagePath" :src="pkg.imagePath" alt="Imagem da Encomenda" class="encomenda-image"/>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Encomenda</h2>
        <form @submit.prevent="saveEdit">
          <div class="form-group">
            <label for="edit-title">
              <i class="fas fa-pencil-alt"></i> Título
            </label>
            <input type="text" id="edit-title" v-model="title" required />
          </div>

          <div class="form-group">
            <label for="edit-apartment">
              <i class="fas fa-home"></i> Apartamento
            </label>
            <input type="text" id="edit-apartment" v-model="apartment" required />
          </div>

          <div class="form-group">
            <label for="edit-datetime">
              <i class="fas fa-calendar-alt"></i> Data e Hora
            </label>
            <input type="datetime-local" id="edit-datetime" v-model="dateTime" required />
          </div>

          <div class="form-group">
            <label for="edit-image">
              <i class="fas fa-image"></i> Imagem (opcional)
            </label>
            <input type="file" id="edit-image" @change="handleImageUpload" />
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
  name: 'DashboardEncomendas',
  data() {
    return {
      title: '',
      apartment: '',
      dateTime: '',
      imageUrl: '',
      packages: [],
      showForm: false,
      showCard: true,
      showMenu: {},
      showEditModal: false,
      editPackageId: null
    };
  },
  methods: {
    closeForm() {
      this.showForm = false;
      this.showCard = true;
    },
    async submitForm() {
      try {
        const newPackage = {
          title: this.title,
          apartment: this.apartment,
          time: this.dateTime,
          imagePath: this.imageUrl || null
        };
        const response = await axios.post('https://backend-condoview.onrender.com/api/users/package', newPackage);
        this.packages.push(response.data.newPackage);
        this.resetForm();
      } catch (error) {
        console.error("Erro ao adicionar encomenda:", error);
      }
    },
    async fetchPackages() {
      try {
        const response = await axios.get('https://backend-condoview.onrender.com/api/users/admin/package');
        this.packages = response.data;
      } catch (error) {
        console.error("Erro ao listar encomendas:", error);
      }
    },
    async deletePackage(id) {
      try {
        await axios.delete(`https://backend-condoview.onrender.com/api/users/admin/package/${id}`);
        this.packages = this.packages.filter(pkg => pkg._id !== id);
      } catch (error) {
        console.error("Erro ao deletar encomenda:", error);
      }
    },
    openEditModal(pkg) {
      this.title = pkg.title;
      this.apartment = pkg.apartment;
      this.dateTime = pkg.time;
      this.imageUrl = pkg.imagePath || '';
      this.editPackageId = pkg._id;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.resetForm();
    },
    async saveEdit() {
      try {
        const updatedPackage = {
          title: this.title,
          apartment: this.apartment,
          time: this.dateTime,
          imagePath: this.imageUrl || null
        };
        const response = await axios.put(`https://backend-condoview.onrender.com/api/users/admin/package/${this.editPackageId}`, updatedPackage);
        const index = this.packages.findIndex(pkg => pkg._id === this.editPackageId);
        if (index !== -1) {
          this.packages[index] = response.data.updatedPackage;
        }
        this.closeEditModal();
      } catch (error) {
        console.error("Erro ao atualizar encomenda:", error);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    resetForm() {
      this.title = '';
      this.apartment = '';
      this.dateTime = '';
      this.imageUrl = '';
      this.showForm = false;
      this.showCard = true;
      this.showEditModal = false;
      this.editPackageId = null;
      this.showMenu = {};
    },
    toggleOptions(id) {
      this.$set(this.showMenu, id, !this.showMenu[id]);
    }
  },
  mounted() {
    this.fetchPackages();
  }
};
</script>

<style>
.dashboard {
  max-width: 800px;
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
  margin-bottom: 20px;
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
input[type="datetime-local"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn-submit {
  margin-top: 10px;
}

.card-container {
  margin-top: 20px;
  max-height: 400px;
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
  padding: 20px;
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
  font-size: 20px;
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
  top: -12px;
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

.encomenda-image {
  max-width: 100%;
  margin-top: 15px;
  border-radius: 4px;
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
