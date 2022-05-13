<template>
  <div class="about">
    <h1>AssLyzer</h1>
    <p>a small webapp to analyise assambler code</p>
    <p>just put the code in the text and let the magic happen</p>
    <button @click="loadExample">Load Example</button>
    <div>
      <textarea name="mainI" id="" cols="75" rows="30" v-model="objdumb"></textarea>
    </div>
    <div>
      <br />
      <br />
      <p>Read input</p>
      <div class="arrlist_wrapper">
        <div class="arrlist">
          <p>Name</p>
          <p>Level</p>
          <p>Addresses</p>
        </div>

        <div class="arrlist" @mouseover="highlihgt(index)" @mouseleave="unhigh(index)" :id="'syncHover1' + index" v-for="(item, index) in input" :key="index">
          <p>{{ item.name }}</p>
          <p>{{ item.lvl }}</p>
          <p v-for="(ad, index2) in item.adrs" :key="index2">{{ ad }}</p>
        </div>
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
      objdumb: "",
    };
  },
  methods: {
    highlihgt(i) {
      document.getElementById("syncHover1" + i).style.backgroundColor = "#ff7171";
      document.getElementById("syncHover2" + i).style.backgroundColor = "#ff7171";
    },
    unhigh(i) {
      document.getElementById("syncHover1" + i).style.backgroundColor = "#ffffff";
      document.getElementById("syncHover2" + i).style.backgroundColor = "#ffffff";
    },
    loadExample() {
      this.objdumb = `
      mov -0x10(%rbp),%rax
      imul %rax,%rax
      cqto
      idivq -0x38(%rbp)
      mov %rax,%rcx
      mov -0x18(%rbp),%rax
      imul %rax,%rax
      cqto
      idivq -0x38(%rbp)
      sub %rax,%rcx
      mov %rcx,%rdx
      mov -0x20(%rbp),%rax
      add %rdx,%rax
      mov %rax,-0x60(%rbp)
      mov -0x10(%rbp),%rax
      imul -0x18(%rbp),%rax
      add %rax,%rax
      cqto
      idivq -0x38(%rbp)
      mov %rax,%rdx
      mov -0x28(%rbp),%rax
      add %rdx,%rax
      mov %rax,-0x18(%rbp)
      `;
    },
    checkmov(el) {
      console.log(el);
      let back = [];
      if (el) {
        el.forEach((elm) => {
          const adrs = elm.match(/%+[a-zA-Z0-1]*/g);
          console.log("l", adrs);
          const name = elm.match(/[A-Za-z]*/);
          if (name[0] === "cqto") back.push({ name: name[0], lvl: null, adrs: null });
          else {
            if (elm.match(/\(/)) {
              back.push({ name: name[0], lvl: 1, adrs: adrs });
            } else {
              back.push({ name: name[0], lvl: 0, adrs: adrs });
            }
          }
        });
      }
      return back;
    },
  },
  watch: {
    objdumb() {
      console.log(this.objdumb);

      const mov = this.objdumb.match(/(mov|imul|idivq)+[\s]+[:$,%?\-<>A-Za-z0-9()]*|cqto+\n/g);
      console.log(this.checkmov(mov));

      this.input = this.checkmov(mov);
      return 1;
    },
  },
};
</script>

<style lang="scss">
.arrlist {
  margin: 5px;
  padding: 5px;

  &_wrapper {
    display: flex;
    flex-direction: row;
  }

  &:hover {
    background-color: #ff7171;
    border-radius: 10px;
  }
}
.gp {
  position: relative;
}
</style>

<!-- 

   0:   55                      push   %rbp
   1:   48 89 e5                mov    %rsp,%rbp
   4:   48 83 ec 50             sub    $0x50,%rsp
   8:   64 48 8b 04 25 28 00    mov    %fs:0x28,%rax
   f:   00 00 
  11:   48 89 45 f8             mov    %rax,-0x8(%rbp)
  15:   31 c0                   xor    %eax,%eax
  17:   c7 45 d0 01 00 00 00    movl   $0x1,-0x30(%rbp)
  1e:   c7 45 d4 05 00 00 00    movl   $0x5,-0x2c(%rbp)
  25:   c7 45 d8 08 00 00 00    movl   $0x8,-0x28(%rbp)
  2c:   c7 45 dc 03 00 00 00    movl   $0x3,-0x24(%rbp)
  33:   c7 45 e0 04 00 00 00    movl   $0x4,-0x20(%rbp)
  3a:   c7 45 e4 02 00 00 00    movl   $0x2,-0x1c(%rbp)
  41:   c7 45 e8 06 00 00 00    movl   $0x6,-0x18(%rbp)
  48:   c7 45 ec 09 00 00 00    movl   $0x9,-0x14(%rbp)
  4f:   c7 45 f0 07 00 00 00    movl   $0x7,-0x10(%rbp)
  56:   c7 45 bc 04 00 00 00    movl   $0x4,-0x44(%rbp)
  5d:   8b 45 bc                mov    -0x44(%rbp),%eax
  60:   89 c2                   mov    %eax,%edx
  62:   c1 ea 1f                shr    $0x1f,%edx
  65:   01 d0                   add    %edx,%eax
  67:   d1 f8                   sar    %eax
  69:   89 45 cc                mov    %eax,-0x34(%rbp)
  6c:   83 7d cc 00             cmpl   $0x0,-0x34(%rbp)
  70:   7e 18                   jle    8a <main+0x8a>
  72:   83 6d cc 01             subl   $0x1,-0x34(%rbp)
  76:   8b 45 cc                mov    -0x34(%rbp),%eax
  79:   89 45 c4                mov    %eax,-0x3c(%rbp)
  7c:   8b 45 cc                mov    -0x34(%rbp),%eax
  7f:   48 98                   cltq   
  81:   8b 44 85 d0             mov    -0x30(%rbp,%rax,4),%eax
  85:   89 45 c0                mov    %eax,-0x40(%rbp)
  88:   eb 64                   jmp    ee <main+0xee>
  8a:   83 7d bc 01             cmpl   $0x1,-0x44(%rbp)
  8e:   0f 8e 36 01 00 00       jle    1ca <main+0x1ca>
  94:   83 6d bc 01             subl   $0x1,-0x44(%rbp)
  98:   8b 45 bc                mov    -0x44(%rbp),%eax
  9b:   48 98                   cltq   
  9d:   8b 44 85 d0             mov    -0x30(%rbp,%rax,4),%eax
  a1:   89 45 c0                mov    %eax,-0x40(%rbp)
  a4:   8b 55 d0                mov    -0x30(%rbp),%edx
  a7:   8b 45 bc                mov    -0x44(%rbp),%eax
  aa:   48 98                   cltq   
  ac:   89 54 85 d0             mov    %edx,-0x30(%rbp,%rax,4)
  b0:   c7 45 c4 00 00 00 00    movl   $0x0,-0x3c(%rbp)
  b7:   eb 35                   jmp    ee <main+0xee>
  b9:   8b 45 c8                mov    -0x38(%rbp),%eax
  bc:   83 e8 01                sub    $0x1,%eax
  bf:   48 98                   cltq   
  c1:   8b 54 85 d0             mov    -0x30(%rbp,%rax,4),%edx
  c5:   8b 45 c8                mov    -0x38(%rbp),%eax
  c8:   48 98                   cltq   
  ca:   8b 44 85 d0             mov    -0x30(%rbp,%rax,4),%eax
  ce:   39 c2                   cmp    %eax,%edx
  d0:   7e 04                   jle    d6 <main+0xd6>
  d2:   83 6d c8 01             subl   $0x1,-0x38(%rbp)
  d6:   8b 45 c8                mov    -0x38(%rbp),%eax
  d9:   48 98                   cltq   
  db:   8b 54 85 d0             mov    -0x30(%rbp,%rax,4),%edx
  df:   8b 45 c4                mov    -0x3c(%rbp),%eax
  e2:   48 98                   cltq   
  e4:   89 54 85 d0             mov    %edx,-0x30(%rbp,%rax,4)
  e8:   8b 45 c8                mov    -0x38(%rbp),%eax
  eb:   89 45 c4                mov    %eax,-0x3c(%rbp)
  ee:   8b 45 c4                mov    -0x3c(%rbp),%eax
  f1:   83 c0 01                add    $0x1,%eax
  f4:   01 c0                   add    %eax,%eax
  f6:   89 45 c8                mov    %eax,-0x38(%rbp)
  f9:   8b 45 c8                mov    -0x38(%rbp),%eax
  fc:   3b 45 bc                cmp    -0x44(%rbp),%eax
  ff:   7c b8                   jl     b9 <main+0xb9>
 101:   8b 45 c8                mov    -0x38(%rbp),%eax
 104:   3b 45 bc                cmp    -0x44(%rbp),%eax
 107:   75 3d                   jne    146 <main+0x146>
 109:   83 6d c8 01             subl   $0x1,-0x38(%rbp)
 10d:   8b 45 c8                mov    -0x38(%rbp),%eax
 110:   48 98                   cltq   
 112:   8b 44 85 d0             mov    -0x30(%rbp,%rax,4),%eax
 116:   39 45 c0                cmp    %eax,-0x40(%rbp)
 119:   7f 23                   jg     13e <main+0x13e>
 11b:   8b 45 c8                mov    -0x38(%rbp),%eax
 11e:   48 98                   cltq   
 120:   8b 54 85 d0             mov    -0x30(%rbp,%rax,4),%edx
 124:   8b 45 c4                mov    -0x3c(%rbp),%eax
 127:   48 98                   cltq   
 129:   89 54 85 d0             mov    %edx,-0x30(%rbp,%rax,4)
 12d:   8b 45 c8                mov    -0x38(%rbp),%eax
 130:   48 98                   cltq   
 132:   8b 55 c0                mov    -0x40(%rbp),%edx
 135:   89 54 85 d0             mov    %edx,-0x30(%rbp,%rax,4)
 139:   e9 87 00 00 00          jmp    1c5 <main+0x1c5>
 13e:   8b 45 c4                mov    -0x3c(%rbp),%eax
 141:   89 45 c8                mov    %eax,-0x38(%rbp)
 144:   eb 68                   jmp    1ae <main+0x1ae>
 146:   8b 45 c4                mov    -0x3c(%rbp),%eax
 149:   48 98                   cltq   
 14b:   8b 44 85 d0             mov    -0x30(%rbp,%rax,4),%eax
 14f:   39 45 c0                cmp    %eax,-0x40(%rbp)
 152:   7f 0e                   jg     162 <main+0x162>
 154:   8b 45 c4                mov    -0x3c(%rbp),%eax
 157:   48 98                   cltq   
 159:   8b 55 c0                mov    -0x40(%rbp),%edx
 15c:   89 54 85 d0             mov    %edx,-0x30(%rbp,%rax,4)
 160:   eb 63                   jmp    1c5 <main+0x1c5>
 162:   8b 45 c4                mov    -0x3c(%rbp),%eax
 165:   83 e8 01                sub    $0x1,%eax
 168:   89 c2                   mov    %eax,%edx
 16a:   c1 ea 1f                shr    $0x1f,%edx
 16d:   01 d0                   add    %edx,%eax
 16f:   d1 f8                   sar    %eax
 171:   89 45 c8                mov    %eax,-0x38(%rbp)
 174:   eb 38                   jmp    1ae <main+0x1ae>
 176:   8b 45 c8                mov    -0x38(%rbp),%eax
 179:   83 e8 01                sub    $0x1,%eax
 17c:   89 c2                   mov    %eax,%edx
 17e:   c1 ea 1f                shr    $0x1f,%edx
 181:   01 d0                   add    %edx,%eax
 183:   d1 f8                   sar    %eax
 185:   89 45 c4                mov    %eax,-0x3c(%rbp)
 188:   8b 45 c4                mov    -0x3c(%rbp),%eax
 18b:   48 98                   cltq   
 18d:   8b 44 85 d0             mov    -0x30(%rbp,%rax,4),%eax
 191:   39 45 c0                cmp    %eax,-0x40(%rbp)
 194:   7e 22                   jle    1b8 <main+0x1b8>
 196:   8b 45 c4                mov    -0x3c(%rbp),%eax
 199:   48 98                   cltq   
 19b:   8b 54 85 d0             mov    -0x30(%rbp,%rax,4),%edx
 19f:   8b 45 c8                mov    -0x38(%rbp),%eax
 1a2:   48 98                   cltq   
 1a4:   89 54 85 d0             mov    %edx,-0x30(%rbp,%rax,4)
 1a8:   8b 45 c4                mov    -0x3c(%rbp),%eax
 1ab:   89 45 c8                mov    %eax,-0x38(%rbp)
 1ae:   8b 45 c8                mov    -0x38(%rbp),%eax
 1b1:   3b 45 cc                cmp    -0x34(%rbp),%eax
 1b4:   75 c0                   jne    176 <main+0x176>
 1b6:   eb 01                   jmp    1b9 <main+0x1b9>
 1b8:   90                      nop
 1b9:   8b 45 c8                mov    -0x38(%rbp),%eax
 1bc:   48 98                   cltq   
 1be:   8b 55 c0                mov    -0x40(%rbp),%edx
 1c1:   89 54 85 d0             mov    %edx,-0x30(%rbp,%rax,4)
 1c5:   e9 a2 fe ff ff          jmp    6c <main+0x6c>
 1ca:   90                      nop
 1cb:   b8 00 00 00 00          mov    $0x0,%eax
 1d0:   48 8b 55 f8             mov    -0x8(%rbp),%rdx
 1d4:   64 48 2b 14 25 28 00    sub    %fs:0x28,%rdx
 1db:   00 00 
 1dd:   74 05                   je     1e4 <main+0x1e4>
 1df:   e8 00 00 00 00          call   1e4 <main+0x1e4>
 1e4:   c9                      leave  
 1e5:   c3                      ret

 -->
