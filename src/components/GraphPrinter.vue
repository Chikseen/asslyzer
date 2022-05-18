<template>
  <div class="graphWrapper">
    <div v-for="(item, i) in toDisplay" :key="i + 'first'" @mouseover="$emit('pHoverO', i)" @mouseleave="$emit('pHoverL', i)">
      <div v-for="(opperator, j) in logic.instruction" :key="j + 'instruction'">
        <span class="graphWrapper_com" :style="`top: ${item.position.y * 25 + (isEasyOffset ? -25 : 0)}px; left: ${item.position[opperator] * 25 + 50}px;`">
          <p>{{ opperator }}</p>
        </span>
        <!--  <div v-for="(item, index) in toDisplay" :key="index + 2" @mouseover="$emit('pHoverO', index)" @mouseleave="$emit('pHoverL', index)">
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
            <div>
              </div>
        <p class="graphWrapper_space" v-if="item.spacer && isautoReduct" :style="`top: ${index * 25}px; left: ${(index + 2) * 25 + item.spacer}px;`">...</p>
      </div>
    </div>-->
      </div>
      <p :id="'syncHover2' + i" class="graphWrapper_com_nos" :style="`top: ${item.position.y * 25 - 16}px; left: ${0}px;`">
        {{ item.fullName }}
      </p>
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
    toDisplay() {
      let oppArray = [];
      let instruction = [];
      let positionTemplate = {};
      let offset = {};
      if (this.logic.instruction) {
        instruction = Object.keys(this.logic.instruction);
        //Set the Postemplate to avoid undefined errors
        instruction.forEach((pos) => {
          positionTemplate[this.logic.instruction[pos]] = 0;
          offset[this.logic.instruction[pos]] = 0;
        });
        positionTemplate.y = 0;
      }

      // merge all 3 informations in one object for easy handling
      this.arr.forEach((elm) => {
        const temp = { ...elm, ...this.logic.opperator[elm.opperatorName], ...{ position: positionTemplate } };
        instruction.forEach((wf) => {
          if (this.logic.opperator[temp.opperatorName].waitFor[this.logic.instruction[wf]] == null)
            temp.waitFor[this.logic.instruction[wf]] = this.logic.instruction[wf];
        });
        oppArray.push(temp);
      });

      //____________
      let toDisplay = [];
      let data = JSON.parse(JSON.stringify(oppArray)); // OMG DEEP AND SHALLOW COPY IS SO MESSY, WTF JS

      // every data in merged array
      for (let i = 0; i < data.length; i++) {
        data[i].position.y = i;
        toDisplay.push(data[i]);

        // every data for positioning
        let shiftby = 0;
        console.log("________", i);
        for (let j = 0; j < instruction.length; j++) {
          const opp = this.logic.instruction[j];
          data[i].position[opp] = j + i + offset[opp] + shiftby;
          if (i - 1 >= 0 && data[i].waitFor[opp] != null) {
            if (data[i - 1].position[data[i].waitFor[opp]] - data[i].position[opp] >= 0) {
              /*               console.log("___");
              console.log(opp); //id
              console.log("waitfor");
              console.log(data[i].waitFor[opp]); //x

              console.log(data[i - 1].position[data[i].waitFor[opp]]); //id
              console.log("waitfor");
              console.log(data[i].position[opp]); //x */
              const oldpos = data[i].position[opp];
              data[i].position[opp] = data[i - 1].position[data[i].waitFor[opp]] + 1;
              shiftby = data[i].position[opp] - oldpos; /*
            console.log("shi", shiftby);
            console.log("diff", data[i].position[opp] - oldpos); */
            } else {
              console.log("no need to wait");
            }
            console.log("compare", data[i].position[this.logic.instruction[j - 1]]);
            console.log("and", data[i].position[opp]);
            if (j > 0 && data[i].position[this.logic.instruction[j - 1]] >= data[i].position[opp]) {
              console.log("pos is same by diff", data[i].position[this.logic.instruction[j - 1]] - data[i].position[opp]);
              data[i].position[opp] = data[i].position[opp] + 1 + (data[i].position[this.logic.instruction[j - 1]] - data[i].position[opp]);
            }
          }
        }
      }

      console.log("toDisplay (befor return)", toDisplay);
      return toDisplay;
    },
  },
  data() {
    return {
      globalOffset: 0,
      result: [],
    };
  },
  methods: {},
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
