### mobile-date-picker
#### a vue component to choose date on mobile
### 快速使用
```text
npm install mobile-date-picker
```
### how to use it
```vue
<template>
  <div>
    <date-picker
        :isOpen="isOpen"
        @onCancel="closePicker"
        @onSelect="handleSelect"
    />
</div>
</template>
```
```javascript
import DatePicker from 'mobile-date-picker';
export default {
  name:'Demo',
  data(){
    return{
      isOpen:false,
      value:""
    }
  },
  components:{
    DatePicker
  },
  methods:{
     handleSelect(value){
       this.value = value;
      },
      openPicker(){
          this.isOpen = true;
      },
      closePicker(){
          this.isOpen = false;
      },
  }
}
```
### props
| props name        | description   |  example value  |
| :--------:   | :-----:  | :----:  |
| isOpen     | handle the component is show or hide |   true(type Boolean)    |
| min        |   Minimum date to choose  |   new Date(1992,0,1)   |
| max        |    The maximum date you can choose    |  new Date(2050,0,1)  |
| dateFormat        |    Format of formatted date    |   ['YYYY', 'MM', 'DD'],  |
| onSelect        |    function   |  ()=>{}  |
| onCancel        |    function   |  ()=>{}  |
