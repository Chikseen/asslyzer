<template>
  <div class="graphWrapper">
    <div v-for="(item, index) in toDisplay" :key="index + 2" @mouseover="$emit('pHoverO', index)" @mouseleave="$emit('pHoverL', index)">
      <div>
        <p v-if="toDisplay[index]" :id="'syncHover2' + index" class="graphWrapper_com_nos" :style="`top: ${index * 25 - (isEasyOffset ? -21 : 4)}px;`">
          {{ toDisplay[index].name }}
        </p>
      </div>
      <div v-if="toDisplay.length > 1">
        <div v-for="(opp, i) in logic.instruction" :key="i + '4'">
          <span class="graphWrapper_com" :style="`top: ${index * 25 + 12}px; left: ${(index + 2) * 25 + item.position[opp]}px;`">
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
    logic: {
      type: Object,
      default: () => {},
    },
    isEasyOffset: { type: Boolean, default: true },
    isautoReduct: { type: Boolean, default: true },
    isResultShow: { type: Boolean, default: true },
  },
  computed: {
    merged() {
      let oppArray = [];
      this.arr.forEach((elm) => {
        oppArray.push({ ...elm, ...this.logic.opperator[elm.name] });
      });
      return oppArray;
    },
    toDisplay() {
      let localOffset = {};

      // Set Offset
      if (this.logic.instruction) {
        for (let i = 0; i < this.logic.instruction.length; i++) {
          localOffset[this.logic.instruction[i]] = i * 25;
        }
        localOffset.spacer = 0;
      }
      console.log("the LocalOffset is: ", localOffset);

      // Spacer Logic
      for (let i = 0; i < this.merged.length; i++) {
        if (this.isautoReduct) {
          for (let j = 1; j < Object.keys(localOffset).length - 1; j++) {
            const key = Object.keys(localOffset)[j];
            console.log("check elm", key);
            if (localOffset[Object.keys(localOffset)[j - 1]] - localOffset[key > 250]) {
              localOffset[key] = localOffset[key] - 150;
              localOffset.spacer = localOffset.spacer + 100;
            } else localOffset.spacer = 0;
          }
        }
      }

      let mergedC = this.merged;
      // Place/WaitFor Logic
      for (let i = 0; i < mergedC.length; i++) {
        mergedC[i].position = {};

        let hasNull = true;
        let waitFor = {};

        Object.keys(localOffset).forEach((elm) => {
          if (mergedC[i].dependsOnpredecessor.waitFor[elm] != null) {
            hasNull = false;
            waitFor = { wait: elm, for: mergedC[i].dependsOnpredecessor.waitFor[elm] };
          }
        });
        console.log("HASNULL", hasNull);
        let takeWith = 0;

        for (let j = 0; j < Object.keys(localOffset).length - 1; j++) {
          const elm = Object.keys(localOffset)[j];
          mergedC[i].position[elm] = localOffset[elm];

          if (mergedC[i].move && mergedC[i - 1]?.position && hasNull) {
            console.log("is this manuekl");
            localOffset[elm] = localOffset[elm] + (mergedC[i].move[elm] + takeWith) * 25;
            takeWith = takeWith + mergedC[i].move[elm];
          } else {
            /*             console.log("_ _ _ _ _");
            console.log("wait", waitFor);
            console.log("merge all after", Object.keys(localOffset).indexOf(waitFor.wait));
 */
            if (j >= Object.keys(localOffset).indexOf(waitFor.wait)) {
              /*               console.log("Push by", waitFor.wait);
              console.log("for", localOffset[waitFor.for]);
              console.log("wait", mergedC[i]?.position[waitFor.wait]);
 */
              if (mergedC[i]?.position[waitFor.wait] < localOffset[waitFor.for]) {
                localOffset[elm] = localOffset[waitFor.for] + (j - 1) * 25;
              }
            }
          }
        }
        takeWith = 0;
      }
      console.log("opp", mergedC);

      return mergedC;
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
    z-index: 5;

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
