<template>
  <d2-container>
    <template slot="header">
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="请输入登录地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
    </template>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row
      style="width: 100%">
      <el-table-column label="会话编号" align="center" >
         <template slot-scope="scope">
          <span>{{scope.row.tokenId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录名称" align="center" >
         <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机" align="center"  >
        <template slot-scope="scope">
          <span>{{scope.row.ipaddr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录地点" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.loginLocation}}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.browser}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作系统" align="center"  >
        <template slot-scope="scope">
          <span>{{scope.row.os}}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleForceLogout(scope.row)"
            v-permission:function="['onlineManager:btn_forceLogout']"
          >强退</el-button>
        </template>
      </el-table-column>
    </el-table>
        <template slot="footer">

 <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="listQuery.offset" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </template>
  </d2-container>
</template>

<script>
import { list, forceLogout } from '@/api/admin/online/index'

export default {
  name: 'Online',
  data () {
    return {
      listQuery: {
        offset: 0,
        limit: 10
      },
      // 遮罩层
      listLoading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 查询参数
      queryParams: {
        ipaddr: undefined,
        userName: undefined
      },
      tableKey: 0

    }
  },
  created () {
    this.getList()
  },
  methods: {
    /** 查询登录日志列表 */
    getList () {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.rows
        this.total = response.total
        this.listLoading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.offset = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.getList()
    },
    /** 强退按钮操作 */
    handleForceLogout (row) {
      this.$confirm('是否确认强退名称为"' + row.userName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return forceLogout(row.tokenId)
      }).then(() => {
        this.getList()
        this.msgSuccess('强退成功')
      }).catch(function () {})
    }
  }
}
</script>
