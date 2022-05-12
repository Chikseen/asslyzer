<template>
  <div class="about">
    <div>
      <p>Current set</p>
      <p class="arrlist" v-for="(item, index) in input" :key="index" @click="rem(index)">
        {{ item }}
      </p>
      <div>
        <input @keyup.enter="add" type="text" v-model="current" />
        <button @click="add">add</button>
      </div>
    </div>
    <GP class="gp" :arr="input" />
  </div>
</template>

<script>
import GP from "@/components/GraphPrinter";

export default {
  components: {
    GP,
  },
  data() {
    return {
      input: [],
      current: "",
    };
  },
  methods: {
    add() {
      this.input.push(this.current);
      this.current = "";
    },
    rem(i) {
      this.input.splice(i, 1);
    },
  },
};
</script>

<style lang="scss">
.arrlist:hover {
  background-color: red;
}
.gp {
  position: relative;
}
</style>
