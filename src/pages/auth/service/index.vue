<template>
  <d2-container>
        <template slot="header">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"  size="small"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter"  size="small">搜索</el-button>
      <el-button class="filter-item" v-if="serviceManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit"  size="small">添加</el-button>
      <el-button type="primary" v-if="serviceManager_btn_clientManager" @click="handlerClient">
          <icon-svg icon-class="27"></icon-svg>授权服务</el-button>
   </div>
        </template>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  @current-change="handleDataCurrentChange" size="small" stripe highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="65">
      <template slot-scope="scope" >
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="服务编码">
      <template slot-scope="scope" >
        <span>{{scope.row.code}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="服务密钥">
      <template slot-scope="scope" >
        <span>{{scope.row.secret}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="服务名">
      <template slot-scope="scope" >
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="是否锁定">
      <template slot-scope="scope" >
        <span>{{scope.row.locked}}</span>
      </template>
    </el-table-column> -->
        <el-table-column width="200px" align="center" label="描述">
      <template slot-scope="scope" >
        <span>{{scope.row.description}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建时间">
      <template slot-scope="scope" >
        <span>{{scope.row.crtTime}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建人">
      <template slot-scope="scope" >
        <span>{{scope.row.crtUser}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建人姓名">
      <template slot-scope="scope" >
        <span>{{scope.row.crtName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建主机">
      <template slot-scope="scope" >
        <span>{{scope.row.crtHost}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="更新时间">
      <template slot-scope="scope" >
        <span>{{scope.row.updTime}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="更新人">
      <template slot-scope="scope" >
        <span>{{scope.row.updUser}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="更新姓名">
      <template slot-scope="scope" >
        <span>{{scope.row.updName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="更新主机">
      <template slot-scope="scope" >
        <span>{{scope.row.updHost}}</span>
      </template>
    </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope" >
        <el-button v-if="serviceManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="serviceManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
        <template slot="footer">

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
        </template>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="服务编码" prop="code">
      <el-input v-model="form.code" placeholder="请输入服务编码"></el-input>
    </el-form-item>
        <el-form-item label="服务密钥" prop="secret">
      <el-input v-model="form.secret" placeholder="请输入服务密钥"></el-input>
    </el-form-item>
        <el-form-item label="服务名" prop="name">
      <el-input v-model="form.name" placeholder="请输入服务名"></el-input>
    </el-form-item>
        <!-- <el-form-item label="是否锁定" prop="locked">
      <el-input v-model="form.locked" placeholder="请输入是否锁定"></el-input>
    </el-form-item> -->
        <el-form-item label="描述" prop="description">
      <el-input v-model="form.description" placeholder="请输入描述"></el-input>
    </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogClientName" :visible.sync="dialogClientVisible">
    <service-client :serviceId="currentId" @closeClientDialog="closeClientDialog" ref="serviceClient"></service-client>
  </el-dialog>
  </d2-container>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/auth/service/index'
import { mapGetters } from 'vuex'
export default {
  name: 'client',
  components: {
    'service-client': () => import('./client')
  },
  data () {
    return {
      form: {
        code: undefined,
        secret: undefined,
        name: undefined,
        description: undefined
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入服务编码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        secret: [
          {
            required: true,
            message: '请输入服务密钥',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入服务名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
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
      dialogFormVisible: false,
      dialogClientName: '授权服务',
      dialogClientVisible: false,
      dialogStatus: '',
      serviceManager_btn_edit: this.hasPermissions(['serviceManager:btn_edit']),
      serviceManager_btn_del: this.hasPermissions(['serviceManager:btn_del']),
      serviceManager_btn_add: this.hasPermissions(['serviceManager:btn_add']),
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      currentId: -1
    }
  },
  created () {
    this.getList()
  },
  computed: {
    ...mapGetters(['elements'])
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
    },
    handleDataCurrentChange (val) {
      this.currentId = val.id
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
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
      }).then(() => {
        delObj(row.id).then(() => {
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
    handlerClient () {
      this.dialogClientVisible = true
      if (this.$refs.serviceClient !== undefined) {
        this.$refs.serviceClient.serviceId = this.currentId
        this.$refs.serviceClient.initClients()
      }
    },
    closeClientDialog () {
      this.dialogClientVisible = false
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
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
      const set = this.$refs
      set[formName].resetFields()
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
