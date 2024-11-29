<template>
  <div class="dashboard" @click="handleClickOutside">
    <h1>
      Gerenciamento de Reservas
    </h1>

    <div class="card-container">
      <div class="card" v-for="reserve in reserves" :key="reserve._id">
        <div class="card-header">
          <span class="card-title">{{ reserve.area || 'Área de Reserva' }}</span>
          <div class="options-container">
            <button class="btn-options" :data-id="reserve._id" @click="toggleOptions(reserve._id)">
              ⋮
            </button>
            <div class="options-menu" :data-id="reserve._id" v-if="showMenu[reserve._id]">
              <button class="btn-approve" @click="approveReserve(reserve._id)">
                <i class="fas fa-check"></i> Aprovar
              </button>
              <button class="btn-reject" @click="rejectReserve(reserve._id)">
                <i class="fas fa-times"></i> Rejeitar
              </button>
              <button class="btn-edit" @click="openEditModal(reserve)">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn-delete" @click="deleteReserve(reserve._id)">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <p><strong>Descrição:</strong> {{ reserve.descricao || 'Sem descrição' }}</p>
          <p><strong>Data:</strong> {{ reserve.data || 'Data não definida' }}</p>
          <p><strong>Horário:</strong> {{ reserve.horarioInicio }} - {{ reserve.horarioFim }}</p>
          <p><strong>Status:</strong> <span :class="statusClass(reserve.status)">{{ reserve.status }}</span></p>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Reserva</h2>
        <form @submit.prevent="saveEdit">
          <div class="form-group">
            <label for="edit-area">Área</label>
            <input type="text" id="edit-area" v-model="editReserve.area" required />
          </div>

          <div class="form-group">
            <label for="edit-descricao">Descrição</label>
            <textarea id="edit-descricao" v-model="editReserve.descricao" required></textarea>
          </div>

          <div class="form-group">
            <label for="edit-data">Data</label>
            <input type="date" id="edit-data" v-model="editReserve.data" required />
          </div>

          <div class="form-group">
            <label for="edit-horarioInicio">Horário Início</label>
            <input type="time" id="edit-horarioInicio" v-model="editReserve.horarioInicio" required />
          </div>

          <div class="form-group">
            <label for="edit-horarioFim">Horário Fim</label>
            <input type="time" id="edit-horarioFim" v-model="editReserve.horarioFim" required />
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
import axios from 'axios';

export default {
  name: 'ReserveDashboard',
  data() {
    return {
      reserves: [],
      showMenu: {},
      showEditModal: false,
      editReserve: {}
    };
  },
  methods: {
    async fetchReserves() {
      try {
        const response = await axios.get('https://backend-condoview.onrender.com/api/users/admin/reserve');
        this.reserves = response.data;
      } catch (error) {
        console.error("Erro ao obter reservas:", error);
      }
    },

    toggleOptions(id) {
      this.$set(this.showMenu, id, !this.showMenu[id]);
    },

    statusClass(status) {
      if (status === 'Aprovada') {
        return 'status-approved';
      } else if (status === 'Rejeitada') {
        return 'status-rejected';
      }
      return 'status-pending';
    },

    async approveReserve(id) {
      try {
        const response = await axios.post(`https://backend-condoview.onrender.com/api/users/admin/reserve/approve/${id}`);
        const index = this.reserves.findIndex(reserve => reserve._id === id);
        if (index !== -1) {
          this.reserves[index] = response.data;
        }
        alert("Reserva aprovada com sucesso!");
      } catch (error) {
        console.error("Erro ao aprovar a reserva:", error.response ? error.response.data : error.message);
        alert("Erro ao aprovar a reserva.");
      }
    },

    async rejectReserve(id) {
      try {
        const response = await axios.post(`https://backend-condoview.onrender.com/api/users/admin/reserve/reject/${id}`);
        const index = this.reserves.findIndex(reserve => reserve._id === id);
        if (index !== -1) {
          this.reserves[index] = response.data;
        }
        alert("Reserva rejeitada com sucesso!");
      } catch (error) {
        console.error("Erro ao rejeitar a reserva:", error.response ? error.response.data : error.message);
        alert("Erro ao rejeitar a reserva.");
      }
    },

    async deleteReserve(id) {
      try {
        await axios.delete(`https://backend-condoview.onrender.com/api/users/admin/reserve/${id}`);
        this.reserves = this.reserves.filter(reserve => reserve._id !== id);
        alert("Reserva excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir a reserva:", error);
        alert("Erro ao excluir a reserva.");
      }
    },

    openEditModal(reserve) {
      this.editReserve = { ...reserve };
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editReserve = {};
    },

    async saveEdit() {
      try {
        const response = await axios.put(`https://backend-condoview.onrender.com/api/users/admin/reserve/${this.editReserve._id}`, this.editReserve);
        const index = this.reserves.findIndex(reserve => reserve._id === this.editReserve._id);
        if (index !== -1) {
          this.reserves[index] = response.data;
        }
        this.closeEditModal();
        alert("Reserva atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar a reserva:", error);
        alert("Erro ao atualizar a reserva.");
      }
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
    this.fetchReserves();
  }
};
</script>
  
<style scoped>
.status-approved {
  color: green;
}

.status-rejected {
  color: red;
}

.status-pending {
  color: orange;
}

.btn-options {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.options-menu {
  display: none;
}

.options-menu[data-id] {
  display: block;
}

.btn-approve,
.btn-reject {
  color: green;
  margin-bottom: 10px;
}

.btn-approve {
  color: green;
}

.btn-reject {
  color: red;
}

.card-container {
  margin-top: 20px;
}

.card {
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  margin-top: 10px;
}

.btn-submit {
  margin-top: 10px;
}
</style>
  