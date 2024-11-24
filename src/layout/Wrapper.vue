<template>
  <div :class="classObject">
    <side-bar v-if="showSidebar">
      <template v-slot:toolbar>
        <toolbar :isIntop="false" />
      </template>
      <template #search>
        <input-search />
      </template>
    </side-bar>
    <vps-header>
      <template #search>
        <transition name="move-input">
          <input-search v-if="!sidebarOpen" />
        </transition>
      </template>
      <template v-slot:toolbar>
        <transition name="move">
          <toolbar v-if="!sidebarOpen" :isIntop="true" />
        </transition>
      </template>
    </vps-header>
    <main-content />
    <vps-footer />
  </div>
</template>

<script>
import SideBar from "./SideBar.vue";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import MainContent from "./MainContent.vue";
import EventBus from "../utils/EventBus.js";
import Toolbar from "../components/bars/Toolbar.vue";
import InputSearch from "../components/form/InputSearch";
import "./style.scss";

export default {
  name: "wrapper",
  components: {
    SideBar,
    "vps-header": Header,
    "vps-footer": Footer,
    MainContent,
    EventBus,
    Toolbar,
    InputSearch
  },
  data() {
    return {
      sidebarOpen: true
    };
  },
  computed: {
    classObject() {
      return [
        "vps-wrapper",
        !this.sidebarOpen ? "vps-wrapper-sidebar--closed" : ""
      ];
    },
    showSidebar() {
    return !['Login', 'Register'].includes(this.$route.name);
  },
  },
  methods: {
    changeCSSVars() {
      document.documentElement.style.setProperty("--toolbar-tran-x", `-${window.innerWidth}px`);
      document.documentElement.style.setProperty("--toolbar-tran-y", `${window.innerHeight}px`);
    }
  },
  mounted() {
    EventBus.$on("toggle-sidebar", isOpen => {
      this.sidebarOpen = isOpen;
    });
    this.changeCSSVars();
    window.addEventListener("resize", () => {
      this.changeCSSVars();
    });
  }
};
</script>

<style>
.move-enter-active,
.move-leave-active,
.move-input-enter-active,
.move-input-leave-active {
  transition: all .8s;
}
.move-enter,
.move-leave-to {
  transform: translate(var(--toolbar-tran-x), var(--toolbar-tran-y));
}
.move-input-enter,
.move-input-leave-to {
  transform: translate(-610px, 154px);
}
</style>
