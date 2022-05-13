<template>
  <div class="graphWrapper">
    <div v-for="(item, index) in toDisplay" :key="index + 2" @mouseover="$emit('pHoverO', index)" @mouseleave="$emit('pHoverL', index)">
      <div>
        <p v-if="arr[index]" :id="'syncHover2' + index" class="graphWrapper_com_nos" :style="`top: ${index * 25 - (isEasyOffset ? -21 : 4)}px;`">
          {{ arr[index].name }}
        </p>
      </div>
      <div v-if="arr.length > 1">
        <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.IF}px;`">IF</p>
        <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.ID}px;`">ID</p>
        <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.RE}px;`">RE</p>
        <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.X}px;`">X</p>
        <p class="graphWrapper_com" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.WB}px;`">WB</p>
        <p class="graphWrapper_space" v-if="item.spacer && isautoReduct" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.spacer}px;`">...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arr: { type: Array, default: () => [] },
    isEasyOffset: { type: Boolean, default: true },
    isautoReduct: { type: Boolean, default: true },
    isResultShow: { type: Boolean, default: true },
  },
  computed: {
    toDisplay() {
      let arr = [];
      let localOffset = { IF: 0, ID: 25, RE: 50, X: 75, WB: 100, spacer: 0 };
      for (let i = 0; i < this.arr.length; i++) {
        if (this.isautoReduct) {
          if (localOffset.RE - localOffset.ID > 250) {
            localOffset.RE = localOffset.RE - 150;
            localOffset.X = localOffset.X - 150;
            localOffset.WB = localOffset.WB - 150;
            localOffset.spacer = localOffset.spacer + 100;
          } else localOffset.spacer = null;
        }
        switch (this.arr[i].name) {
          // MOV
          case "mov":
            if (this.arr[i - 1] && this.arr[i - 1].adrs && this.arr[i].adrs) {
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
              arr.push({ ...localOffset });
              localOffset.RE = localOffset.RE + 50;
              localOffset.X = localOffset.X + 50;
              localOffset.WB = localOffset.WB + 75;
            }
            break;
          // IMU
          case "imul":
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE + 25;
            localOffset.X = localOffset.X + 25;
            break;
          // CQTO
          case "cqto":
            arr.push({ ...localOffset });
            localOffset.X = localOffset.X + 25;
            localOffset.WB = localOffset.WB + 25;
            break;
          // IDIVQ
          case "idivq":
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE - 25;
            localOffset.X = localOffset.X - 50;
            localOffset.WB = localOffset.WB - 50;
            break;
          // SUB
          case "sub":
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE + 25;
            localOffset.X = localOffset.X + 25;
            localOffset.WB = localOffset.WB + 25;
            break;
          // SUB
          case "add":
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE + 50;
            localOffset.X = localOffset.X + 50;
            localOffset.WB = localOffset.WB + 50;
            break;
          // SUBQ
          case "leaq":
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE + 25;
            localOffset.X = localOffset.X + 25;
            localOffset.WB = localOffset.WB + 25;
            break;
          case "jg":
            arr.push({ ...localOffset });
            localOffset.RE = localOffset.RE + 25;
            localOffset.X = localOffset.X + 25;
            localOffset.WB = localOffset.WB + 25;
            break;
          case "movl":
            arr.push({ ...localOffset });
            break;
          case "xorl":
            arr.push({ ...localOffset });
            break;
          case "jmp":
            arr.push({ ...localOffset });
            break;
          case "imulq":
            arr.push({ ...localOffset });
            break;
          case "sarq":
            arr.push({ ...localOffset });
            break;
          case "addl":
            arr.push({ ...localOffset });
            break;
          case "subq":
            arr.push({ ...localOffset });
            break;
          case "movq":
            arr.push({ ...localOffset });
            break;
          case "cmpq":
            arr.push({ ...localOffset });
            break;
          default:
            return { localOffset };
        }
      }
      arr.push({ ...localOffset });
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
  position: relative;
  top: 0;
  left: 0;

  &__printer {
    width: 25px;
    height: 25px;
  }

  &_com {
    position: absolute;
    border: 1px solid;
    width: 23px;
    height: 23px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background-color: #f0f0f0;
    font-size: 0.75rem;
    border-radius: 2px;
    transition: all 0.2s;

    &_nos {
      position: absolute;
      border: none;
      left: 0;
      width: 100%;
      height: 25px;
      padding-left: 5px;
      background-color: #ffffff00;
      border-radius: 5px;
      transition: all 0.2s;
    }
  }
  &_space {
    position: absolute;
    width: 23px;
    height: 23px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background-color: #ff7171;
    font-size: 0.75rem;
    border-radius: 2px;
    transition: all 0.2s;
  }
}
</style>
