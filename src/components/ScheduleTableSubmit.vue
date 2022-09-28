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
                <tr v-for="(period, indexOut) in periodsArray">
                    <td>{{ period }}</td>
                    <td v-for="indexIn of weekdayArray.length-1">
                        <el-checkbox class="checkbox" size="large" @change="checked=>handleFreeTime(indexIn-1, indexOut, checked as boolean)" v-model="refFreeTimeChecked[(weekdayArray.length-1) * indexOut + indexIn - 1]"></el-checkbox>
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
                    <el-select class="workSelector" v-model="selectValue" placeholder="请选择意向岗位" size="large">
                        <el-option
                            v-for="work in workOptions"
                            :key="work.value"
                            :label="work.label"
                            :value="work">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="acceptAdjust" label="服从调剂" size="large"></el-checkbox>
                </td>
            </tr>
            <!-- 按钮 -->
            <tr>
                <td class="btnArea" :colspan="weekdayArray.length">
                    <el-button type="primary" @click="submit">提交</el-button>
                </td>
            </tr>
        </table>
    </div>
</template>

<!-- css -->
<style>
    .tableArea {
        position: absolute;
        width: 80%;
        /* 居中 */
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border: 3px solid #409EFF;
        border-radius: 25px;
        box-shadow: 10px 10px 2px #ECF5FF;
        margin-top: 20px;      
    }

    table {
        width: 95%;
        margin: 10px auto;
        font-size: 25px;
        /* 消除表格之间的缝隙 */
        border-collapse: collapse;
    }

    table {
        line-height: 70px;
    }

    .tablePrompt {
        text-align: center;
        /* background-color: lightgray; */
        font-size: 30px;
        font-weight: 800;
    }

    .weekdayPrompt {
        background-color: #ECF5FF;
        border: 2px solid #409EFF;
        font-weight: normal;
        text-align: center;
    }

    tbody tr td {
        border: 2px solid #409EFF;
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

    .checkbox {
        zoom: 200%;
    }
</style>


<!-- typescript -->
<script lang="ts" setup>
    import { onBeforeMount, ref } from 'vue';
    import axios from 'axios';
import { fa, tr } from 'element-plus/es/locale';

    // 时间段数据
    let periodsArray = [
        '09:00-10:00',
        '10:00-12:00',
        '13:30-16:10',
        '16:10-18:00',
        '19:00-21:00'
    ]
    // 星期几数据
    let weekdayArray = [
        // 第一个元素留白
        '',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日',
    ]

    // 数据类型接口
    type workOptionsT = {
        value: string,
        label: string
    }
    // 数据
    let selectValue = ref('')
    let acceptAdjust = ref(false)
    let netid = "test_id"
    let workOptions:Array<workOptionsT> = [
        {
            value: 'frontWork',
            label: '前台'
        },
        {
            value: 'backWork',
            label: '后台'
        }
    ]
    let freeTimeBinary: Array<number> = []
    let freeTimeChecked:Array<boolean> = []
    const refFreeTimeChecked = ref(freeTimeChecked)
    let isPost = true // 判断是否已经提交过数据了

    // 函数
    // 初始化页面之后调用的函数
    onBeforeMount(() => {
        // 初始化 freeTimeChecked 二维布尔数组
        for (let i = 0; i < periodsArray.length * (weekdayArray.length - 1); i++) {
            freeTimeChecked.push(false)
        }
        // 初始化 freeTimeBinary 数组
        for (let i = 0; i < weekdayArray.length - 1; i++) {
            freeTimeBinary.push(0)
        }
        // 从数据库上下载数据
        var getConfig = {
            method: "get",
            url: "http://localhost:8080/api/est/" + netid
        }
        axios(getConfig)
        .then(function(response) {
            if (response.data.msg == "not found") {
                isPost = false
            } else {
                // 设置 netid
                netid = response.data["netid"]
                // 设置意向岗位
                if (response.data["intention"] === false) {
                    selectValue.value = workOptions[0].label
                } else if (response.data["intention"] === true) {
                    selectValue.value = workOptions[1].label
                }
                // 设置是否调剂
                acceptAdjust.value = response.data["accept_adjust"]
                // 标记空闲时间
                // 注意：虽然视觉上存储时间表状态应该用一个二维的布尔数组，但是因为一些很复杂的原因，这里用的是一位布尔数组，即将二维数组转换成一维数组
                freeTimeBinary = JSON.parse(response.data["free_time"])
                for (let i = 0; i < freeTimeBinary.length; i++) {
                    let save = freeTimeBinary[i]
                    for (let j = 0; j < periodsArray.length; j++) {
                        let temp = save % 2
                        if (temp == 1) {
                            freeTimeChecked[j * (weekdayArray.length - 1) + i] = true
                        }
                        save =  Math.floor(save / 2)
                    }
                }
            }
        })
        .catch(function(error) {
            console.log(error)
        })
    })
    // 处理选择时间的逻辑
    function handleFreeTime(weekday:number, period:number, checked:boolean) {
        let binaryIndex:number = 1
        for (let i = 0; i < period; i++) {
            binaryIndex *= 2
        }

        if (checked === true) {
            freeTimeBinary[weekday] += binaryIndex
        } else if (checked === false) {
            freeTimeBinary[weekday] -= binaryIndex
        }
    }
    
    // 处理提交的逻辑
    function submit(e:Event) {
        // 处理下拉框数据
        const selectValueTarget = Object.assign({}, selectValue.value)
        const selectValueTargetValue = (selectValueTarget as unknown as workOptionsT).value
        let selectValueSubmit
        if (selectValueTargetValue === 'frontWork') {
            selectValueSubmit = 0
        } else {
            selectValueSubmit = 1
        }
        // 处理服从调剂选项的数据
        let acceptAdjustSubmit
        if (acceptAdjust.value === false) {
            acceptAdjustSubmit = 0
        } else {
            acceptAdjustSubmit = 1
        }

        // 提交数据
        if (isPost === false) {
            var dataSubmit = JSON.stringify({
                "netid": netid,
                "free_time": JSON.stringify(freeTimeBinary),
                "intention": selectValueSubmit,
                "accept_adjust": acceptAdjustSubmit
            })
            var postConfig = {
                method: 'post',
                url: 'http://localhost:8080/api/est',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: dataSubmit
            }

            axios(postConfig)
            .then(function(response) {
                console.log(response)
            }).catch(function(response) {
                console.log(response)
            })
        } else if (isPost === true) {
            var dataSubmit = JSON.stringify({
                "netid": netid,
                "free_time": JSON.stringify(freeTimeBinary),
                "intention": selectValueSubmit,
                "accept_adjust": acceptAdjustSubmit
            })
            var putConfig = {
                method: 'put',
                url: 'http://localhost:8080/api/est/' + netid,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: dataSubmit
            }
            axios(putConfig)
            .then(function(response) {
                console.log(response)
            }).catch(function(response) {
                console.log(response)
            })
        }
        
    }

</script>
