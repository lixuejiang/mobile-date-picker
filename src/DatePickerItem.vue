<template>
    <div class="datepicker-item" @touchstart="handleStart" @touchmove="handleMove" @touchend="handleEnd">
        <div class="datepicker-viewport">
            <div class="datepicker-wheel">
                <ul ref="scroll" class="datepicker-scroll" :style="scrollStyle">
                    <li v-for="(date,i) in dates" :key="i" :class="{disabled:(date < min || date >max)}">
                        {{convertDate(date,format)}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    const dateHeight = 30;                              // 每个日期的高度
    const dateLength = 10;                              // 日期的个数
    const midIndex = Math.floor(dateLength / 2);     // 日期数组中间值的索引
    const midY = - dateHeight * midIndex;       // translateY值
    import * as base from './utils';
    export default {
        name: 'DatePickerItem',
        data(){
            return {
                animating: false,
                touchY: 0,
                move:0,
                currentIndex: midIndex,
                translateY: midY,
                dates:[],
                date:this.value
            }
        },
        props:{
            value:{
                type:Date
            },
            min:{
                type:Date
            },
            max:{
                type:Date
            },
            typeName:{
                type:String
            },
            format:{
                type:String
            }
        },
        watch:{
            value(val){
                this.date = val;
            },
            date(val){
                this.initDate(val);
            }
        },
        created(){
            this.initDate(this.date);
        },
        computed: {
            scrollStyle(){
                const marginTop = (this.currentIndex - midIndex) * dateHeight;
                return base.formatCss({
                    transform: `translateY(${this.translateY}px)`,
                    marginTop: marginTop+'px',
                })
            }
        },
        methods: {
            convertDate(date, format) {
                let str = format;
                const o = {
                    'M+': date.getMonth() + 1,
                    'D+': date.getDate(),
                    'h+': date.getHours(),
                    'm+': date.getMinutes(),
                    's+': date.getSeconds(),
                };
                if (/(Y+)/.test(format)) {
                    str = str.replace(RegExp.$1,
                        (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
                }
                for (const k in o) {
                    if (new RegExp(`(${k})`).test(format)) {
                        str = str.replace(RegExp.$1,
                            (RegExp.$1.length === 1) ?
                                o[k] : (`00${o[k]}`.substr((o[k].toString()).length)));
                    }
                }
                return str;
            },
            initDate(date){
                this.dates = Array(...Array(dateLength)).map((value, index) =>
                    base[`next${this.typeName}`](date, index - midIndex));
            },
            updateDates(direction) {
                if (direction === 1) {
                    this.currentIndex ++;
                    this.dates = [...this.dates.slice(1),base[`next${this.typeName}`](this.dates[this.dates.length - 1], 1)]
                } else {
                    this.currentIndex --;
                    this.dates = [ base[`next${this.typeName}`](this.dates[0], -1), ...this.dates.slice(0, this.dates.length - 1),]
                }
            },
            checkIsUpdateDates(direction, translateY) {
                return direction === 1 ? this.currentIndex * dateHeight + dateHeight / 2 < -translateY : this.currentIndex * dateHeight - dateHeight / 2 > -translateY;
            },
            clearTransition(obj) {
                base.addPrefixCss(obj, { transition: '' });
            },
            moveToNext(direction){
                const date = this.dates[midIndex];
                if (direction === -1 && date.getTime() < this.min.getTime()) {
                    this.updateDates(1);
                } else if (direction === 1 && date.getTime() > this.max.getTime()) {
                    this.updateDates(-1);
                }
                this.moveTo(this.$refs.scroll, this.currentIndex);
            },
            moveTo(obj, currentIndex){
                this.animating = true;
                base.addPrefixCss(obj, { transition: 'transform .2s ease-out' });
                this.translateY = -currentIndex * dateHeight;
                setTimeout(() => {
                    this.animating = false;
                    this.$emit('input',this.dates[midIndex]);
                    this.clearTransition(this.$refs.scroll);
                }, 200);
            },
            handleStart(e){
                e.preventDefault();
                this.touchY = e.pageY || e.targetTouches[0].pageY;
                this.move = this.translateY;
            },
            handleMove(e){
                e.preventDefault();
                const touchY = e.pageY || e.targetTouches[0].pageY;
                const dir = touchY - this.touchY;
                const translateY = this.move + dir;
                const direction = dir > 0 ? -1 : 1;
                const date = this.dates[midIndex];
                if (date.getTime() < this.min.getTime() ||
                    date.getTime() > this.max.getTime()) {
                    return;
                }
                if (this.checkIsUpdateDates(direction, translateY)) {
                    this.updateDates(direction);
                }
                this.translateY = translateY;
            },
            handleEnd(e){
                e.preventDefault();
                const touchY = e.pageY || e.changedTouches[0].pageY;
                const dir = touchY - this.touchY;
                const direction = dir > 0 ? -1 : 1;
                this.moveToNext(direction);
            }
        },
    }
</script>
<style lang="scss" scoped>
    .datepicker-item {
        flex: 1;
        margin: 0 .25em;
    }
    .datepicker-viewport {
        height: 200px;
        position: relative;
        overflow: hidden;
        &::after {
            content: '';
            position: absolute;
            z-index: 2;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            pointer-events: none;
            background: linear-gradient(#f7f7f7,rgba(245,245,245,0)52%,rgba(245,245,245,0)48%,#f7f7f7);
        }
    }
    .datepicker-wheel {
        position: absolute;
        height: 30px;
        top: 50%;
        margin-top: -20px;
        width: 100%;
        border-top: 1px solid #dbdbdb;
        border-bottom: 1px solid #dbdbdb;
    }
    .datepicker-scroll {
        list-style-type: none;
        li {
            height: 30px;
            line-height: 30px;
            font-size: 1.1em;
            cursor: pointer;
            color:(#f7f7f7 contrast(50%));
            &.disabled{
                color:(#f7f7f7 blend(#f7f7f7 70%));
            }
        }
    }
</style>