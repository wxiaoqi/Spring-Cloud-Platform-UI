<template>
  <!-- <div class="app-container calendar-list-container"> -->
  <d2-container>
    <template slot="header">

      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="操作人姓名"
          v-model="listQuery.crtName" size="small"> </el-input>
        <el-button class="filter-item" type="primary" size="small" icon="search" @click="handleFilter">搜索
        </el-button>
      </div>
    </template>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="菜单"><template slot-scope="scope">
          <span>
            {{scope.row.menu}}</span>
        </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="操作"><template slot-scope="scope">
          <span>
            {{scope.row.opt}}</span>
        </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="资源路径"><template slot-scope="scope">
          <span>
            {{scope.row.uri}}</span>
        </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="操作时间"><template slot-scope="scope">
          <span>
            {{scope.row.crtTime}}</span>
        </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="操作人ID"><template slot-scope="scope">
          <span>
            {{scope.row.crtUser}}</span>
        </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="操作人"><template slot-scope="scope">
          <span>
            {{scope.row.crtName}}</span>
        </template>

      </el-table-column>
      <el-table-column width="100px" align="center" label="操作主机"><template slot-scope="scope">
          <span>
            {{scope.row.crtHost}}</span>
        </template>
      </el-table-column>
      <el-table-column width="400px" align="center" label="请求数据"><template slot-scope="scope">
          <span>
            {{scope.row.body}}</span>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">

      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </template>
  </d2-container>
</template>

<script>
import {
  page
} from '@/api/admin/gateLog/index'
export default {
  name: 'gateLog',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        crtName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      gateLogManager_btn_edit: '1',
      gateLogManager_btn_del: '1',
      gateLogManager_btn_add: '1',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.rows
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>
