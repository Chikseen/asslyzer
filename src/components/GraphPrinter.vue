<template>
  <div class="graphWrapper">
    <div v-for="(item, index) in toDisplay" :key="index + 2" @mouseover="$emit('pHoverO', index)" @mouseleave="$emit('pHoverL', index)">
      <div>
        <p v-if="arr[index]" :id="'syncHover2' + index" class="graphWrapper_com_nos" :style="`top: ${index * 25 - (isEasyOffset ? -21 : 4)}px;`">
          {{ arr[index].name }}
        </p>
      </div>
      <div v-if="arr.length > 1">
        <div v-for="(opp, i) in logic.instruction" :key="i + '2'">
          <span class="graphWrapper_com" :style="`top: ${(index * 25)+ 11}px; left: ${(index + 2) * 25 + item[opp]}px;`">
            <p>{{ opp }}</p>
          </span>
        </div>
        <p class="graphWrapper_space" v-if="item.spacer && isautoReduct" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.spacer}px;`">...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arr: { type: Array, default: () => [] },
    logic: { type: Object, default: () => {} },
    isEasyOffset: { type: Boolean, default: true },
    isautoReduct: { type: Boolean, default: true },
    isResultShow: { type: Boolean, default: true },
  },
  computed: {
    toDisplay() {
      let arr = [];
      let localOffset = { spacer: 0 };

      if (this.logic.instruction) {
        for (let i = 0; i < this.logic.instruction.length; i++) {
          localOffset[this.logic.instruction[i]] = i * 25;
        }
      }

      for (let i = 0; i < this.arr.length; i++) {
        if (this.isautoReduct) {
          if (localOffset.RE - localOffset.ID > 250) {
            localOffset.RE = localOffset.RE - 150;
            localOffset.X = localOffset.X - 150;
            localOffset.WB = localOffset.WB - 150;
            localOffset.spacer = localOffset.spacer + 100;
          } else localOffset.spacer = null;
        }

        const elment = this.logic.opperator[this.arr[i].name];
        const merged = { ...elment, ...this.arr[i] };
        arr.push({ ...localOffset });

        this.logic.instruction.forEach((elm) => {
          if (merged.move) {
            localOffset[elm] = localOffset[elm] + merged.move[elm] * 25;
          }
        });
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
