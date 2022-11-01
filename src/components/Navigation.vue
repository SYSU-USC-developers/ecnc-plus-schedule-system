<template>
    <el-menu
        :default-active="activeIndex"
        class="global-top-navigation"
        mode="horizontal"
        router
    >
        <!-- 首页 -->
        <el-menu-item index="1">首页</el-menu-item>
        <!-- 班表 -->
        <el-sub-menu index="2">
            <template #title>班表</template>
            <el-menu-item index="/scheduleTableSubmit">提交（修改）班表</el-menu-item>
            <el-menu-item index="/schedule">排班</el-menu-item>
        </el-sub-menu>
        <!-- 请假 -->
        <!-- <el-sub-menu index="3">
            <template #title>请假</template>
            <el-menu-item index="3-1">请假申请</el-menu-item>
            <el-menu-item index="3-2">请假查询</el-menu-item>
        </el-sub-menu> -->
    </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 导航默认激活第一项
const activeIndex = ref('1')
</script>