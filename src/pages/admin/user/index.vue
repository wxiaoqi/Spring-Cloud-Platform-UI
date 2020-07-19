<template>
  <d2-container>
    <template slot="header">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right: 20px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name" size="small"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="small">搜索</el-button>
    </template>
    <el-button class="filter-item"  v-permission:function="['userManager:btn_add']"  style="margin-left: 10px;" @click="handleCreate" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row style="width: 100%;margin-top: 20px">
    <el-table-column align="center" label="序号" width="65"> <template slot-scope="scope" >
          <span>{{scope.row.id}}</span>
        </template> </el-table-column>
    <el-table-column width="200" align="center" label="姓名"> <template slot-scope="scope" >
        <span>{{scope.row.name}}</span>
      </template> </el-table-column>
    <el-table-column width="110" align="center" label="账户"> <template slot-scope="scope" >
            <span>{{scope.row.username}}</span>
          </template> </el-table-column>
    <el-table-column width="110" align="center" label="性别"> <template slot-scope="scope" >
            <span>{{scope.row.sex}}</span>
          </template> </el-table-column>
    <el-table-column width="300" align="center" label="备注"> <template slot-scope="scope" >
            <span>{{scope.row.description}}</span>
          </template> </el-table-column>
    <el-table-column width="180" align="center" label="最后时间"> <template slot-scope="scope" >
          <span>{{scope.row.updTime}}</span>
        </template> </el-table-column>
    <el-table-column width="200" align="center" label="最后更新人"> <template slot-scope="scope" >
            <span>{{scope.row.updName}}</span>
          </template> </el-table-column>
    <el-table-column align="center" label="操作" width="150" fixed="right"> <template slot-scope="scope" >
    <el-button  v-permission:function="['userManager:btn_edit']" size="small" type="success" @click="handleUpdate(scope.row)">编辑
    </el-button>
    <el-button v-permission:function="['userManager:btn_del']" size="small" type="danger" @click="handleDelete(scope.row)">删除
    </el-button>
      </template> </el-table-column>
  </el-table>
  <!-- <div v-show="!listLoading" class="pagination-container"> -->
  <template slot="footer">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </template>
  <!-- </div> -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="账户" prop="username">
        <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
        <el-input v-else v-model="form.username" placeholder="请输入账户" readonly></el-input>
      </el-form-item>
      <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
          <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.description"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>
  </d2-container>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/admin/user/index'
import { mapGetters } from 'vuex'
export default {
  name: 'userManager',
  data () {
    return {

      form: {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: this.hasPermissions(['userManager:btn_edit']),
      userManager_btn_del: false,
      userManager_btn_add: false,
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
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList () {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
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
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id)
        .then(response => {
          this.form = response
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            })
        })
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp () {
      this.form = {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
      }
    }
  }
}
</script>
