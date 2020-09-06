<template>
  <d2-container>
      <template slot="header">
        <div class="filter-container">
          <el-select size="small" class="filter-item" v-model="listQuery.dbName" @change="handleFilter" placeholder="请选择数据源" style="margin-right:10px">
            <el-option v-for="item in  dbsOptions" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
          <el-input  size="small" @keyup.enter.native="handleFilter" style="width: 200px;margin-right:10px" class="filter-item" placeholder="表名"
            v-model="listQuery.tableName"></el-input>
          <el-button  size="small" class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
          <el-button  size="small" class="filter-item" type="primary" @click="handlerGenerator">生成代码</el-button>
        </div>
      </template>
      <el-table :key="tableKey" :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row
        style="width: 100%" @select="handlerSelect">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="表名">
          <template slot-scope="scope">
            <span>{{scope.row.tableName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="表备注">
          <template slot-scope="scope">
            <span>{{scope.row.tableComment}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </template>
      <el-dialog :title="dialogProjectName" :visible.sync="dialogProjectFormVisible">
        <el-form :model="buildProjectForm" :rules="buildProjectFormRules" ref="buildProjectForm" label-width="100px">
          <el-form-item label="package" prop="package">
            <el-input v-model="buildProjectForm.package" placeholder="请输入代码包路径"></el-input>
          </el-form-item>
          <el-form-item label="移除表前缀" prop="tablePrefix">
            <el-input v-model="buildProjectForm.tablePrefix" placeholder="请输入移除表前缀"></el-input>
          </el-form-item>
          <el-form-item label="前端模块名">
            <el-input v-model="buildProjectForm.mainModule" placeholder="请输入前端模块名"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="buildProjectForm.author" placeholder="请输入作者"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('buildProjectForm')">取 消</el-button>
          <el-button type="primary" @click="buildProject('buildProjectForm')">确 定</el-button>
        </div>
      </el-dialog>
  </d2-container>
</template>

<script>
import {
  page,
  dbs
} from '@/api/dev/code/index'
import util from '@/libs/util'

export default {
  name: 'tableManager',
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
      buildProjectForm: {
        package: undefined,
        tablePrefix: '',
        author: '',
        mainModule: ''
      },
      buildProjectFormRules: {
        package: [{
          required: true,
          message: '请输入合法的包路径',
          trigger: 'blur'
        },
        {
          min: 3,
          message: '长度在 3个字符以上',
          trigger: 'blur'
        }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableKey: 0,
      tables: [],
      dialogProjectName: '代码生成',
      dialogProjectFormVisible: false,
      dbsOptions: []
    }
  },
  created () {
    this.getDbs()
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
    getDbs () {
      dbs().then(response => {
        this.dbsOptions = response.rows
        this.listQuery.dbName = response.rows[0]
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
    },
    handlerGenerator () {
      this.dialogProjectFormVisible = true
    },
    handlerSelect (val, row) {
      let flag = true
      for (let i = 0; i < val.length; i++) {
        if (val[i].tableName === row.tableName) {
          this.tables.push(row.tableName)
          flag = false
          break
        }
      }
      if (flag) {
        const nTables = []
        for (let i = 0; i < this.tables.length; i++) {
          if (this.tables[i] !== row.tableName) {
            nTables.push(this.tables[i])
          }
        }
        this.tables = nTables
      }
    },
    cancel (formName) {
      this.dialogProjectFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    buildProject (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          const elink = document.createElement('a')
          elink.style.display = 'none'
          elink.target = '_blank'
          elink.href = process.env.VUE_APP_API +
              '/api/code/generator/build?tables=' + this.tables.concat() + '&author=' + this.buildProjectForm.author + '&path=' + this.buildProjectForm.package + '&mainModule=' + this.buildProjectForm.mainModule + '&dbName=' + this.listQuery.dbName + '&tablePrefix=' + this.buildProjectForm.tablePrefix + '&token=' + util.cookies.get('token')
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      })
    }
  }
}
</script>
