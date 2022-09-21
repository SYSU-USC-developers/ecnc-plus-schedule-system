<!-- html -->
<template>
    <div class="tableArea">
        <table>
            <thead>
                <!-- 班表提示语 -->
                <tr>
                    <td class="tablePrompt" :colspan="weekdayArray.length">
                        班表
                    </td>
                </tr>
                <!-- 显示周几的表头 -->
                <tr>
                    <th class="weekdayPrompt" v-for="weekday in weekdayArray">{{ weekday }}</th>
                </tr>
            </thead>
            <!-- 显示时间段 -->
            <tbody>
                <tr v-for="period in periodsArray">
                    <td>{{ period }}</td>
                    <td v-for="index of weekdayArray.length-1">
                        <el-checkbox></el-checkbox>
                    </td>
                </tr>
            </tbody>
            <!-- 班表意向 -->
            <tr>
                <td class="tablePrompt" :colspan="weekdayArray.length">
                    意向填写
                </td>
            </tr>
            <tr>
                <td class="wishArea" :colspan="weekdayArray.length">
                    <el-select class="workSelector" v-model="selectValue" placeholder="请选择意向岗位">
                        <el-option
                            v-for="work in workOptions"
                            :key="work.value"
                            :label="work.label"
                            :value="work">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="acceptAdjust" label="服从调剂"></el-checkbox>
                </td>
            </tr>
            <!-- 按钮 -->
            <tr>
                <td class="btnArea" :colspan="weekdayArray.length">
                    <el-button type="primary">提交</el-button>
                    <el-button type="danger">重置</el-button>
                </td>
            </tr>
        </table>
    </div>
</template>

<!-- css -->
<style>
    .tableArea {
        width: 80%;
        margin: 0 auto;
        border: 3px solid;
        border-radius: 25px;
        box-shadow: 10px 5px 5px gray;
        margin-top: 20px;
    }

    table {
        width: 95%;
        margin: 10px auto;
        font-size: 20px;
        /* 消除表格之间的缝隙 */
        border-collapse: collapse;
    }

    table td {
        line-height: 70px;
    }

    .tablePrompt {
        text-align: center;
        background-color: lightgray;
        font-size: 25px;
        font-weight: 800;
    }

    .weekdayPrompt {
        background-color: rgba(38,137,13,1);
        border: 1px solid rgba(134,188,37,1);
        font-weight: normal;
        text-align: center;
        color: white;
    }

    tbody tr td {
        border: 1px solid rgba(134,188,37,1);
        text-align: center;
    }

    .wishArea {
        width: 100%;
        text-align: center;
        /* border: 1px solid; */
    }

    .workSelector {
        margin-right: 20px;
    }

    .btnArea {
        text-align: center;
    }
</style>


<!-- typescript -->
<script lang="ts" setup>
    import { ref } from 'vue';

    // 时间段数据
    const periodsArray = ref([
        '09:00-10:00',
        '10:00-12:00',
        '13:30-16:10',
        '16:10-18:00',
        '19:00-21:00'
    ])
    // 星期几数据
    const weekdayArray = ref([
        // 第一个元素留白
        '',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日',
    ])

    // 支援岗位数据
    const selectValue = ref('')
    const acceptAdjust = ref('')
    const workOptions = ref([
        {
            value: 'frontWork',
            label: '前台'
        },
        {
            value: 'backWork',
            label: '后台'
        }
    ])
</script>
