<template>
    <div class="maintenance-dashboard" @click="handleClickOutside">
        <h1>
            Gerenciamento de Manutenções
        </h1>

        <div class="card-container">
            <div class="card" v-for="maintenance in maintenances" :key="maintenance._id">
                <div class="card-header">
                    <span class="card-title">{{ maintenance.type || 'Tipo de Manutenção' }}</span>
                    <div class="options-container">
                        <button class="btn-options" :data-id="maintenance._id" @click="toggleOptions(maintenance._id)">
                            ⋮
                        </button>
                        <div class="options-menu" :data-id="maintenance._id" v-if="showMenu[maintenance._id]">
                            <button class="btn-approve" @click="approveMaintenance(maintenance._id)">
                                <i class="fas fa-check"></i> Aprovar
                            </button>
                            <button class="btn-reject" @click="rejectMaintenance(maintenance._id)">
                                <i class="fas fa-times"></i> Rejeitar
                            </button>
                            <button class="btn-edit" @click="openEditModal(maintenance)">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn-delete" @click="deleteMaintenance(maintenance._id)">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p><strong>Descrição:</strong> {{ maintenance.descriptionMaintenance || 'Sem descrição' }}</p>
                    <p><strong>Data:</strong> {{ maintenance.dataMaintenance || 'Data não definida' }}</p>
                    <p><strong>Status:</strong> <span :class="statusClass(maintenance.status)">{{ maintenance.status
                    }}</span></p>
                    <p><strong>Usuário:</strong> {{ maintenance.usuarioNome || 'Nome não definido' }}</p>
                    <div v-if="maintenance.imagePath">
                        <img :src="maintenance.imagePath" alt="Imagem da manutenção" class="maintenance-image" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showEditModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeEditModal">&times;</span>
                <h2>Editar Manutenção</h2>
                <form @submit.prevent="saveEdit">
                    <div class="form-group">
                        <label for="edit-type">Tipo</label>
                        <input type="text" id="edit-type" v-model="editMaintenance.type" required />
                    </div>

                    <div class="form-group">
                        <label for="edit-description">Descrição</label>
                        <textarea id="edit-description" v-model="editMaintenance.descriptionMaintenance"
                            required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="edit-data">Data</label>
                        <input type="date" id="edit-data" v-model="editMaintenance.dataMaintenance" required />
                    </div>

                    <div class="form-group">
                        <label for="edit-usuario">Usuário</label>
                        <input type="text" id="edit-usuario" v-model="editMaintenance.usuarioNome" required />
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
    name: 'MaintenanceDashboard',
    data() {
        return {
            maintenances: [],
            showMenu: {},
            showEditModal: false,
            editMaintenance: {}
        };
    },
    methods: {
        async fetchMaintenances() {
            try {
                const response = await axios.get('https://backend-condoview.onrender.com/api/users/admin/maintenance');
                this.maintenances = response.data;
            } catch (error) {
                console.error("Erro ao obter manutenções:", error);
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

        async approveMaintenance(id) {
            try {
                const response = await axios.post(`https://backend-condoview.onrender.com/api/users/admin/maintenance/approve/${id}`);
                const index = this.maintenances.findIndex(maintenance => maintenance._id === id);
                if (index !== -1) {
                    this.maintenances[index] = response.data;
                }
                alert("Manutenção aprovada com sucesso!");
            } catch (error) {
                console.error("Erro ao aprovar a manutenção:", error.response ? error.response.data : error.message);
                alert("Erro ao aprovar a manutenção.");
            }
        },

        async rejectMaintenance(id) {
            try {
                const response = await axios.post(`https://backend-condoview.onrender.com/api/users/admin/maintenance/reject/${id}`);
                const index = this.maintenances.findIndex(maintenance => maintenance._id === id);
                if (index !== -1) {
                    this.maintenances[index] = response.data;
                }
                alert("Manutenção rejeitada com sucesso!");
            } catch (error) {
                console.error("Erro ao rejeitar a manutenção:", error.response ? error.response.data : error.message);
                alert("Erro ao rejeitar a manutenção.");
            }
        },

        async deleteMaintenance(id) {
            try {
                await axios.delete(`https://backend-condoview.onrender.com/api/users/admin/maintenance/${id}`);
                this.maintenances = this.maintenances.filter(maintenance => maintenance._id !== id);
                alert("Manutenção excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir a manutenção:", error);
                alert("Erro ao excluir a manutenção.");
            }
        },

        openEditModal(maintenance) {
            this.editMaintenance = { ...maintenance };
            this.showEditModal = true;
        },

        closeEditModal() {
            this.showEditModal = false;
            this.editMaintenance = {};
        },

        async saveEdit() {
            try {
                const response = await axios.put(`https://backend-condoview.onrender.com/api/users/admin/maintenance/${this.editMaintenance._id}`, this.editMaintenance);
                const index = this.maintenances.findIndex(maintenance => maintenance._id === this.editMaintenance._id);
                if (index !== -1) {
                    this.maintenances[index] = response.data;
                }
                this.closeEditModal();
                alert("Manutenção atualizada com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar a manutenção:", error);
                alert("Erro ao atualizar a manutenção.");
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
        this.fetchMaintenances();
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
