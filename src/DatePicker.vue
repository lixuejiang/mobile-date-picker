<template>
        <div v-if="isOpen">
            <div class="datepicker-mask" @click="closeDatePicker"></div>
            <div class="datepicker-modal" v-if="isOpen">
                <div class="datepicker">
                    <div class="datepicker-header"></div>
                    <div class="datepicker-navbar">
                        <a href="javascript:void (0)" class="datepicker-navbar-btn" v-for="(btn, i) in btns" :key="i" @click="handleBtnClick(i)">
                            {{btn.btnName}}
                        </a>
                    </div>
                    <div class="datepicker-content">
                        <date-picker-item
                                v-for="(format, i) in dateFormat"
                                :key="i"
                                :min="min"
                                :max="max"
                                :typeName="typeName[i]"
                                :format="format"
                                v-model="date"
                        />
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
    import * as base from './utils';
    import DatePickerItem from './DatePickerItem.vue';
    export default {
        name: 'DatePicker',
        components: {
            DatePickerItem
        },
        data() {
            return {
                date: base.nextDate(this.value),
                typeName:["Year","Month","Date"],
                closing:false
            };
        },
        props: {
            btns:{
                type:Array,
                default:()=>[
                    {
                        btnName: '取消'
                    },
                    {
                        btnName: '确定'
                    }
                ]
            },
            isOpen:{
                type:Boolean,
                default:()=>false
            },
            value:{
                type: Date,
                default:()=>{
                    return  new Date();
                }
            },
            min:{
                type: Date,
                default:()=>{
                   return new Date(1970, 0, 1);
                }
            },
            max:{
                type: Date,
                default:()=>{
                    return new Date(2050, 0, 1);
                }
            },
            dateFormat:{
                type:Array,
                default:()=>{
                   return  ['YYYY', 'MM', 'DD'];
                }
            },
            onSelect:{
                type:Function,
                default:()=>{}
            }
        },
        methods: {
            closeDatePicker(){
                this.$emit('onCancel')
            },
            handleBtnClick(i){
                if (i === 0) {
                    this.closeDatePicker()
                } else {
                    this.handleFinalClick()
                }
            },
            handleFinalClick(){
                this.$nextTick(function () {
                  this.$emit('onSelect',base.convertDate(this.date, 'YYYY-MM-DD'));
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .datepicker-mask{
        position: fixed;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 1;
    }
    .datepicker-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .datepicker {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 999;
        height: 266px;
        font-size: 15px;
        color: #586c94;
        text-align: center;
        background-color: #f7f7f7;
        font-family: arial, verdana, sans-serif;
        box-sizing: content-box;
        -webkit-font-smoothing: antialiased;
        user-select: none;
        .datepicker-header {
            padding: 0 .5em;
            min-height: 2em;
            line-height: 2em;
            font-size: 1.125em;
            display: none;
        }
        .datepicker-navbar {
            overflow: hidden;
            padding: 0;
            border-bottom: 1px solid #dbdbdb;
        }
        .datepicker-navbar-btn {
            height: 2.5em;
            line-height: 2.5em;
            padding: 0 1em;
            cursor: pointer;
            color: #586c94;
            font-size: 1.1em;
            &:first-child {
                float: left;
            }
            &:last-child {
                float: right;
            }
        }
        .datepicker-content {
            display: flex;
            padding: .5em .25em;
        }
    }
</style>