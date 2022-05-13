<template>
  <div class="graphWrapper">
    <div v-for="(item, index) in toDisplay" :key="index + 2">
      <div>
        <p class="graphWrapper_com_nos" :style="`top: ${index * 25}px;`">{{ arr[index].name }}</p>
        <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.IF}px;`">IF</p>
      </div>
      <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.ID}px;`">ID</p>
      <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.RE}px;`">RE</p>
      <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.X}px;`">X</p>
      <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.WB}px;`">WB</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arr: { type: Array, default: () => [] },
  },
  computed: {
    toDisplay() {
      let arr = [];
      let localOffset = { IF: 0, ID: 25, RE: 50, X: 75, WB: 100 };

      for (let i = 0; i < this.arr.length; i++) {
        switch (this.arr[i].name) {
          // MOV
          case "mov":
            console.log("mov");
            console.log("mov", this.arr[i].name);
            if (this.arr[i - 1] && this.arr[i - 1].adrs && this.arr[i].adrs) {
              console.log("hi", this.arr[i].adrs.filter((element) => this.arr[i - 1].adrs.includes(element)).length != 0);
              if (this.arr[i].adrs.filter((element) => this.arr[i - 1].adrs.includes(element)).length != 0) {
                arr.push({ ...localOffset });
                localOffset.RE = localOffset.RE + 50;
                localOffset.X = localOffset.X + 50;
                localOffset.WB = localOffset.WB + 75;
              } else {
                arr.push({ ...localOffset });
                localOffset.RE = localOffset.RE + 50;
                localOffset.X = localOffset.X + 50;
                localOffset.WB = localOffset.WB + 50;
              }
            } else {
              console.log("thisused???")
              arr.push({ ...localOffset });
              localOffset.RE = localOffset.RE + 50;
              localOffset.X = localOffset.X + 50;
              localOffset.WB = localOffset.WB + 75;
            }
            break;
          // IMU
          case "imul":
            console.log("imu");
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE + 25;
            localOffset.X = localOffset.X + 25;
            break;
          case "cqto":
            console.log("cqto");
            arr.push({ ...localOffset });
            localOffset.X = localOffset.X + 25;
            localOffset.WB = localOffset.WB + 25;
            break;
          case "idivq":
            console.log("idivq");
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE - 25;
            localOffset.X = localOffset.X - 50;
            localOffset.WB = localOffset.WB - 50;
            break;
          default:
            return { localOffset };
        }
      }
      return arr;
    },
  },
  data() {
    return {
      globalOffset: 0,
    };
  },
};
</script>

<style lang="scss">
.graphWrapper {
  position: absolute;
  top: 0;
  left: 0;

  &_com {
    position: absolute;
    border: 1px solid;
    width: 24px;
    height: 24px;
    background-color: rgb(240, 240, 240);

    &_nos {
      position: absolute;
      border: none;
      left: 0;
      width: 40px;
      height: 24px;

      background-color: rgb(255, 255, 255);
    }
  }
}
</style>
