<template>
  <div class="vps-main-content">
    <div class="vps-theme-settings" :class="drawerClasses">
      <vps-button @click.native="showThemeSettings = !showThemeSettings">
        <icon name="palette"/>
      </vps-button>
      <vps-drawer>
        <card>
          <template #header>
            <div class="vps-icon-text">
              <icon name="palette" fill="#222"/>
              <span>Configurações de tema</span>
            </div>
          </template>
          <template #body>
            <div class="vps-theme-colors">
              <label
                class="vps-theme-color"
                v-for="(col, key, i) in colors"
                @click="chooseTheme(col)"
                :key="i"
              >
                <div class="color" :style="{background: col.sidebarColor}"></div>
              </label>
            </div>
          </template>
          <template #footer></template>
        </card>
      </vps-drawer>
    </div>

    <div class="vps-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { List, ListItem } from "../components/lists";
import Card from "../components/containers/Card";
import Icon from "../components/icons";
import Drawer from "../components/containers/Drawer";
import Button from "../components/actions/Button";

export default {
  data() {
    return {
      showThemeSettings: false,
      colors: {
        theme1: { sidebarColor: "#004D40" },
        theme2: { sidebarColor: "#2e003e" },
        theme3: { sidebarColor: "#05386B" },
        theme4: { sidebarColor: "#022140" },
        theme5: { sidebarColor: "#0c0023" },
        theme6: { sidebarColor: "#38003c" },
        theme7: { sidebarColor: "#330136" },
        theme8: { sidebarColor: "#191226" },
        theme9: { sidebarColor: "#702C8E" },
        theme10: { sidebarColor: "#2A4C59" },
        theme11: { sidebarColor: "#103754" },
        theme12: { sidebarColor: "#332851" },
        theme13: { sidebarColor: "#2D4057" },
        theme14: { sidebarColor: "#214D72" },
        theme15: { sidebarColor: "#071E22" },
        theme16: { sidebarColor: "#434858" },
        theme17: { sidebarColor: "#651e3e" },
        theme18: { sidebarColor: "#0072ff" },
        theme19: { sidebarColor: "#34495e" },
        theme20: { sidebarColor: "#2b2d5c" },
        theme21: { sidebarColor: "#323E40" },
        theme22: { sidebarColor: "#1D1D2C" },
        theme23: { sidebarColor: "#1D1D2C" },
        theme24: { sidebarColor: "#306073" },
        theme25: { sidebarColor: "#0f256e" },
        theme26: { sidebarColor: "#05004E" },
        theme27: { sidebarColor: "#3e1063" },
        theme28: { sidebarColor: "#2F2440" },
        theme29: { sidebarColor: "#0A7EA2" },
        theme30: { sidebarColor: "#1A1C29" },
        theme31: { sidebarColor: "#0011B2" },
        theme32: { sidebarColor: "#006bbb" },
        theme33: { sidebarColor: "#752092" },
        theme34: { sidebarColor: "#7A04DD" },
        theme35: { sidebarColor: "#273253" },
        theme36: { sidebarColor: "#254B62" },
        theme37: { sidebarColor: "#002E9D" },
        theme38: { sidebarColor: "#343434" },
        theme39: { sidebarColor: "#303960" },
        theme40: { sidebarColor: "#120136" },
        theme41: { sidebarColor: "#2d334a" },
        theme42: { sidebarColor: "#454d66" },
        theme43: { sidebarColor: "#30475e" }
      }
    };
  },
  computed: {
    drawerClasses() {
      return {
        "vps-theme-settings-hidden": !this.showThemeSettings,
        "vps-theme-settings-shown": this.showThemeSettings
      };
    }
  },
  methods: {
    chooseTheme(color, newTheme = true) {
      document.documentElement.style.setProperty(
        "--side-bg-color",
        color.sidebarColor
      );
      document.documentElement.style.setProperty(
        "--sidebarColor",
        color.sidebarColor
      );
      if (newTheme) {
        localStorage.setItem("vpscolor", JSON.stringify(color));
      }
    }
  },
  components: {
    List,
    ListItem,
    Card,
    Icon,
    "vps-drawer": Drawer,
    "vps-button": Button
  },
  mounted() {
    let defaultTheme = { sidebarColor: "#0FA774" };
    try {
      let item = localStorage.getItem("vpscolor");
      let theme = item ? JSON.parse(item) : defaultTheme;
      this.chooseTheme(theme, false);
    } catch (error) {
      this.chooseTheme(defaultTheme, false);
    }
  }
};
</script>

<style>
.vps-theme-settings {
  display: flex;
  align-items: center;
  position: absolute;
}
.vps-theme-settings-hidden {
  right: -280px;
  transition: all 1s;
}
.vps-theme-settings-shown {
  right: 0;
  transition: all 1s;
}
.vps-theme-colors {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 8px; 
}

.vps-theme-colors h4 {
  text-align: center;
  color: #555;
}

.vps-theme-colors .vps-theme-color {
  display: flex;
  cursor: pointer;
  justify-content: center; 
}

.vps-theme-colors .vps-theme-color .color {
  height: 24px;
  width: 200px;
  border-radius: 4px; 
}
</style>
