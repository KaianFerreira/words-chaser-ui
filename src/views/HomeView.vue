<template>
  <main>
    <div class="letters">
      <div class="letter" v-for="(letter, i) in letters" :key="i">
        <input
          type="text"
          :value="letter"
          maxlength="1"
          @input="changeValue"
          @keydown.backspace="remove(i)"
          @keydown.enter="search"
          :ref="`letter${i}`"
          :id="`letter-${i}`"
        >
      </div>
      <div class="letter add-letter" @click="letters.push('')">+</div>
    </div>
    <div class="results">
      <div class="letters-length">
        <div class="letter" v-for="(letterLen, i) in Object.keys(filteredResults)" :key="`letterLen-${i}`">
          <div class="title">{{ letterLen }}</div>
          <div class="words">
            <div class="word" v-for="(word, i) in filteredResults[letterLen].words" :key="`${letterLen}-word-${i}`">{{ word }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { getFiltered } from '@/api/words';
  
  export default {
    data: () => ({
      letters: ['', '', '', ''],
      focus: 0,
      result: []
    }),
    watch: {
      focus(currentFocous) {
        const nextInput = `letter${currentFocous}`
        const ref = this.$refs[nextInput]

        if (!ref) this.letters.push('')
      }
    },
    computed: {
      formattedLetters() {
        return this.letters.reduce((acc, cur) => {
          if (!cur) return acc
          const foundLetter = acc.find(letterObj => letterObj.letter === cur)
          if (foundLetter) foundLetter.recurrence++
          else acc.push({
            letter: cur,
            recurrence: 1
          })

          return acc
        }, [])
      },
      filteredResults() {
        const sortedResults = this.result.slice(0).sort((a, b) => a.length - b.length)
        return sortedResults.reduce((acc, cur) => {
          const letterLen = String(cur).length
          const letterObjKey = `${letterLen}letter`
          const letterObj = acc[letterObjKey]

          if (letterObj) {
            letterObj.words.push(cur)
          } else {
            acc[letterObjKey] = {
              words: [cur]
            }
          }
          return acc
        }, {})
      }
    },
    methods: {
      async search() {
        this.result = await getFiltered(this.formattedLetters)
      },
      remove(index) {
        if (index === 0) return
        const arrLength = this.letters.length - 1
        const nextInput = `letter${index - 1}`
        
        
        if (arrLength === index && arrLength > 3) {
          this.letters.pop()
        }
        
        this.$nextTick(() => {
          const ref = this.$refs[nextInput]
          ref[0].focus()
          console.log(index)
          this.letters[index - 1] = ''
        })
      },
      async changeValue(event) {
        const {
          data: value,
          target: { id },
        } = event

        if (!value) return
        
        const currentInput = Number(id.split('-')[1])
        const nextInput = `letter${currentInput + 1}`
        const ref = this.$refs[nextInput]
        
        this.letters[currentInput] = value
        
        if (!ref || ref.length === 0) this.letters.push('')
        
        this.$nextTick(() => {
          const newRef = this.$refs[nextInput]
          newRef[0].focus()
        })
      },
      changeFocus(current) {
        this.focus = current+1
        
        // const { data: value } = event
        

        // console.log(event)
        // console.log(this.$refs[nextInput])
        // const ref = this.$refs[nextInput]

        // if (!ref) this.letters.push('')

        // this.$refs[nextInput][0].focus()
      }
    },
  }
</script>
<style lang="scss" scoped>
.letters-length {
  display: flex;
  gap: 32px;
  font-size: 1.5rem;
}
.letters {
  display: flex;
  flex-wrap: wrap;
  .letter {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid yellow;

    input {
      border: none;
      background-color: transparent;
      color: #fff;
      outline: none;
      font-size: 2rem;
      width: 1.4rem;
    }
  }
  .add-letter {
    cursor: pointer;
  }
}
</style>
