<template>
  <div class="dashboard">
    <h1>
      Cadastro de Assembleia
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
          <label for="subject">
            <i class="fas fa-comment-dots"></i> Assunto
          </label>
          <input type="text" id="subject" v-model="subject" required />
        </div>

        <div class="form-group">
          <label for="date">
            <i class="fas fa-calendar-alt"></i> Data
          </label>
          <input type="date" id="date" v-model="date" required />
        </div>

        <div class="form-group">
          <label for="time">
            <i class="fas fa-clock"></i> Horário de Início
          </label>
          <input type="time" id="time" v-model="time" required />
        </div>

        <button type="button" @click="showModal = true" class="btn-add-agenda">
          <i class="fas fa-plus"></i> Adicionar Pauta
        </button>

        <div class="agenda-container">
          <div v-for="(item, index) in agendaItems" :key="index" class="agenda-item">
            <p><strong>Título:</strong> {{ item.title }}</p>
            <p><strong>Assunto:</strong> {{ item.subject }}</p>
            <div class="vote-buttons">
              <button @click="vote(index, 'yes')" :disabled="item.voted" class="btn-vote yes">Sim</button>
              <button @click="vote(index, 'no')" :disabled="item.voted" class="btn-vote no">Não</button>
              <button @click="vote(index, 'abstention')" :disabled="item.voted" class="btn-vote abstention">Abstenção</button>
            </div>
            <p class="vote-count">
              <strong>Votos:</strong> Sim: {{ item.votes.yes }} | Não: {{ item.votes.no }} | Abstenção: {{ item.votes.abstention }}
            </p>
          </div>
        </div>

        <button type="submit" class="btn-submit">
          <i class="fas fa-paper-plane"></i> Criar Assembleia
        </button>
      </form>
    </div>

    <div class="btn-container" v-if="!showForm">
      <button @click="showForm = true; showCard = false;" class="btn-add">
        <i class="fas fa-plus"></i> Adicionar Assembleia
      </button>
    </div>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h2>Adicionar Pauta</h2>
        <div class="modal-form-group">
          <label for="agendaTitle">Título da Pauta</label>
          <input type="text" id="agendaTitle" v-model="newAgendaTitle" required />
        </div>
        <div class="modal-form-group">
          <label for="agendaSubject">Assunto da Pauta</label>
          <input type="text" id="agendaSubject" v-model="newAgendaSubject" required />
        </div>
        <button @click="addAgendaItem" class="btn-submit">Adicionar Pauta</button>
      </div>
    </div>

    <div class="card-container" v-if="showCard">
      <div class="card">
        <div class="card-header">
          <span class="card-title">{{ title || 'Título da Assembleia' }}</span>
          <div class="options-container">
            <button class="btn-options" @click="toggleOptions">
              ⋮
            </button>
            <div v-if="showMenu" class="options-menu">
              <button class="btn-edit" @click="editAssembly">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn-delete" @click="deleteAssembly">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <p><strong>Assunto:</strong> {{ subject || 'N/A' }}</p>
          <p><strong>Data:</strong> {{ date || 'N/A' }}</p>
          <p><strong>Horário:</strong> {{ time || 'N/A' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardAssembleia',
  data() {
    return {
      title: '',
      subject: '',
      date: '',
      time: '',
      agendaItems: [],
      showForm: false,
      showCard: true,
      showMenu: false,
      showModal: false,
      newAgendaTitle: '',
      newAgendaSubject: '',
    };
  },
  methods: {
    submitForm() {
      console.log('Assembleia criada:', {
        title: this.title,
        subject: this.subject,
        date: this.date,
        time: this.time,
        agendaItems: this.agendaItems
      });
      this.resetForm();
      this.showCard = true;
    },
    addAgendaItem() {
      if (this.newAgendaTitle && this.newAgendaSubject) {
        this.agendaItems.push({
          title: this.newAgendaTitle,
          subject: this.newAgendaSubject,
          votes: {
            yes: 0,
            no: 0,
            abstention: 0,
          },
          voted: false,
        });
        this.newAgendaTitle = '';
        this.newAgendaSubject = '';
        this.showModal = false;
      }
    },
    vote(index, option) {
      if (!this.agendaItems[index].voted) {
        if (option === 'yes') this.agendaItems[index].votes.yes++;
        if (option === 'no') this.agendaItems[index].votes.no++;
        if (option === 'abstention') this.agendaItems[index].votes.abstention++;
        this.agendaItems[index].voted = true;
        console.log(`Voto registrado na pauta ${index + 1}: ${option}`);
      }
    },
    resetForm() {
      this.title = '';
      this.subject = '';
      this.date = '';
      this.time = '';
      this.agendaItems = [];
      this.showForm = false;
    },
    closeForm() {
      this.resetForm();
      this.showCard = true;
    },
    toggleOptions() {
      this.showMenu = !this.showMenu;
    },
    editAssembly() {
      console.log('Editando assembleia:', {
        title: this.title,
        subject: this.subject,
        date: this.date,
        time: this.time,
        agendaItems: this.agendaItems
      });
      this.showForm = true;
      this.showCard = false;
      this.showMenu = false;
    },
    deleteAssembly() {
      console.log('Excluindo assembleia:', {
        title: this.title,
        subject: this.subject,
        date: this.date,
        time: this.time,
        agendaItems: this.agendaItems
      });
      this.resetForm();
      this.showCard = false;
      this.showMenu = false;
    }
  }
}
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

.btn-add-agenda {
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

.btn-add-agenda:hover {
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
input[type="date"],
input[type="time"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.card-container {
  margin-top: 20px;
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.modal-form-group {
  margin-bottom: 20px;
}

.modal-form-group label {
  margin-bottom: 5px;
}

.modal-form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.agenda-container {
  margin-top: 10px;
}

.agenda-item {
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.vote-buttons {
  margin-top: 10px;
}

.btn-vote {
  margin-right: 5px;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-vote.yes {
  background-color: #28a745;
}

.btn-vote.yes:hover {
  background-color: #218838;
}

.btn-vote.no {
  background-color: #dc3545;
}

.btn-vote.no:hover {
  background-color: #c82333;
}

.btn-vote.abstention {
  background-color: #6c757d;
}

.btn-vote.abstention:hover {
  background-color: #5a6268;
}

.vote-count {
  margin-top: 10px;
}
</style>
