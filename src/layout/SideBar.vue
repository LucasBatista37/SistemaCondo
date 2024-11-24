<template>
  <aside class="vps-sidebar" :class="{'vps-sidebar-closed': !isOpen}">
    <div class="vps-logo">
      <h3>CondoView</h3>
    </div>
    <div class="vps-sidebar-user">
      <div class="vps-sidebar-user--details">
        <div class="vps-sidebar-user-avatar">
          <avatar/>
        </div>
        <div class="vps-sidebar-user-name">
          <b>Juan Coutinho</b>
        </div>
        <div class="vps-sidebar-user-role">Administrator</div>
        <div
          class="vps-sidebar-user-status"
          :style="{'--status-color': '#06ef61'}"
        >Online</div>
      </div>
    </div>

    <div class="vps-sidebar-search">
      <slot name="search"></slot>
    </div>
    <ul class="vps-sidebar-menu">
      <li class="vps-sidebar-menu-header">
        <h4>Adicionar</h4>
      </li>
      <li
        v-for="(item, index) in items"
        :key="item.label"
        class="vps-sidebar-menu-item"
        @click="selectItem(index)"
      >
        <div
          class="vps-sidebar-menu-item-content"
          :class="{
            'vps-sidebar-menu-item-content-expanded': expandedIndex === index,
            'no-arrow': item.label === 'Avisos' || item.label === 'Encomendas' || item.label === 'Assembleia' || item.label === 'Adicionar Morador'
          }"
        >
          <icon
            class="vps-sidebar-menu-item-content-icon"
            :name="item.icon ? item.icon : 'Addon'"
            height="16px"
            width="16px"
          />
          <div class="vps-sidebar-menu-item-content-label">
            {{ item.label }}
          </div>
          <div v-if="item.details" class="vps-sidebar-menu-item-content-details">
            <badge :color="item.details.color" :text="item.details.text"/>
          </div>
          <icon
            name="ArrowRight"
            class="vps-sidebar-arrow"
            height="12px"
            width="12px"
            v-if="item.children && item.label !== 'Avisos' && item.label !== 'Encomendas' && item.label !== 'Assembleia' && item.label !== 'Adicionar Morador'"
            :class="{'vps-sidebar-rotate-arrow': expandedIndex === index}"
          />
        </div>
      </li>
      <li class="vps-sidebar-menu-header">
        <h4>Aprovar</h4>
      </li>
      <li v-for="(item, index) in extraItems" :key="item.label" class="vps-sidebar-menu-item">
        <div class="vps-sidebar-menu-item-content">
          <icon
            class="vps-sidebar-menu-item-content-icon"
            :name="item.icon ? item.icon : 'Addon'"
            height="16px"
            width="16px"
          />
          <div class="vps-sidebar-menu-item-content-label">{{ item.label }}</div>
          <div v-if="item.details" class="vps-sidebar-menu-item-content-details">
            <badge :color="item.details.color" :text="item.details.text"/>
          </div>
        </div>
      </li>
      <li class="vps-sidebar-menu-header">
        <h4>Visualizar</h4>
      </li>
      <li v-for="(viewItem, index) in viewItems" :key="viewItem.label" class="vps-sidebar-menu-item">
        <div class="vps-sidebar-menu-item-content">
          <icon
            class="vps-sidebar-menu-item-content-icon"
            :name="viewItem.icon"
            height="16px"
            width="16px"
          />
          <div class="vps-sidebar-menu-item-content-label">{{ viewItem.label }}</div>
        </div>
      </li>
    </ul>

    <slot name="toolbar"></slot>
  </aside>
</template>

<script>
import Icon from "../components/icons";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import EventBus from "../utils/EventBus.js";

export default {
  name: "side-bar",
  data() {
    return {
      isOpen: true,
      items: [
        {
          label: "Avisos",
          icon: "Bell",
          route: "/avisos",
          details: {
            text: "5",
            color: "#ffff11",
          }
        },
        {
          label: "Encomendas",
          icon: "Envelope",
          route: "/encomendas",
          details: {
            text: "3",
            color: "#ff4444"
          }
        },
        {
          label: "Assembleia",
          icon: "Clipboard",
          route: "/assembleia",
          children: [
            {
              label: "Subitem 1",
              route: "/assembleia/subitem1"
            },
            {
              label: "Subitem 2",
              route: "/assembleia/subitem2"
            }
          ]
        },
        {
          label: "Adicionar Morador",
          icon: "AddResident",
          route: "/coming-soon"
        }
      ],
      extraItems: [
        {
          label: "Reserva",
          icon: "Reservation",
          details: {
            text: "+9",
            color: "#1111ff"
          }
        },
        {
          label: "Manutenção",
          icon: "Maintenance"
        },
      ],
      viewItems: [
        {
          label: "Ocorrências",
          icon: "Eye",
          route: "/dashboard3/ocorrencias"
        },
        {
          label: "Moradores",
          icon: "User",
          route: "/dashboard3/moradores"
        }
      ],
      expandedIndex: -1
    };
  },
  methods: {
    selectItem(index) {
      const item = this.items[index];
      if (item && item.route) {
        this.$router.push(item.route);
      }
      this.expandedIndex = this.expandedIndex === index ? -1 : index; 
    }
  },
  components: {
    Icon,
    Avatar,
    Badge
  },
  mounted() {
    EventBus.$on("toggle-sidebar", isOpen => {
      this.isOpen = isOpen;
    });
  }
};
</script>
