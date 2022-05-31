<template>
  <div>
    <div>
      <input type="number" name="" id="" min="0" max="999999" step="1" v-model="arrLength" />
      <p>int myNumbers[ {{ arrLength }} ] = { {{ result }} }</p>
      <button @click="copyTC">Copy</button>
      <div class="arrGen_radio">
        <label for="">
          Random
          <input type="radio" name="sort" id="" v-model="picked" value="s" />
        </label>
        <label for="">
          Acc
          <input type="radio" name="sort" id="" v-model="picked" value="a" />
        </label>
        <label for="">
          Dec
          <input type="radio" name="sort" id="" v-model="picked" value="d" />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    result() {
      const arr = [];
      for (let i = 0; i < this.arrLength; i++) {
        arr.push(i);
      }
      if (this.picked === "s")
        return arr
          .sort(() => 0.5 - Math.random())
          .toString()
          .replace("[", "")
          .replace("]", "");
      if (this.picked === "d") return arr.reverse().toString().replace("[", "").replace("]", "");
      return arr.toString().replace("[", "").replace("]", "");
    },
  },
  data() {
    return {
      arrLength: 10,
      picked: "s",
    };
  },
  methods: {
    copyTC() {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(this.result);
      return Promise.reject("The Clipboard API is not available.");
    },
  },
};
</script>

<style lang="scss">
.arrGen_radio {
  display: flex;
  flex-direction: column;
}
</style>
