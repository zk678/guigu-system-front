<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form label-width="70px" size="small">
            <el-row>
                <el-col :span="6">
                <el-form-item label="角色名称">
                    <el-input style="width: 95%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>

                    
                </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
                    <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="batchRemove()" >批量删除</el-button>
                </el-col>
            </el-row>
            </el-form>
            <div>
                <el-button type=""></el-button>
            </div>
        </div>
      <!-- 表格 -->
        <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%;margin-top: 10px;" 
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"/>
        <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"  />
        <el-table-column prop="roleName" label="角色编码" />
        <el-table-column prop="createTime" label="创建时间" width="160"/>
        
        <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"/> 
            <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限"/>       
        </template>
        </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[3, 5, 7, 9]"
            :page-size="limit"
            style="padding: 30px 0; text-align: center;"
            layout="sizes,total, prev, pager, next, jumper"
            :total="total"
            />

            <!-- 弹框 添加/修改-->
            <el-dialog title="" :visible.sync="dialogVisible" width="40%" >
                <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
                  <el-form-item label="角色名称">
                    <el-input v-model="sysRole.roleName"/>
                  </el-form-item>
                  <el-form-item label="角色编码">
                    <el-input v-model="sysRole.roleCode"/>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
                  <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
                </span>
          </el-dialog>

    </div>
</template>
<script>
import api from '@/api/system/role.js'
export default {
    //定义初始值
    data() {
        return {
            listLoading:false,
            list:[], // 角色列表
            total:0, // 总记录数
            page:1, // 页码
            limit:3, // 每页记录数
            searchObj:{}, // 查询条件
            sysRole:{}, // 封装添加表单的对象
            dialogVisible:false, //弹框
            id:1,
            selections:[]//复选框选择的
        }
    },
    //created页面渲染之前执行
    created() {
        //调用列表方法
        this.fetchData()
    },
    //具体方法
    methods : {
        handleSelectionChange(selection){
        // console.log(selection)
            this.selections = selection
        },
        handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
            this.fetchData(this.page,val)
        },
        handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
            this.fetchData(val,this.limit)
        },
        //列表方法
        //pageNum 查询第几页
        fetchData(page = 1,limit=3){
            this.page = page,
            this.limit = limit;
            this.listLoading = true,
            //ajax
            api.getPageList(this.page,this.limit,this.searchObj).then(response => {
                this.listLoading = false,
                this.total = response.data.total,
                this.list = response.data.records
            })
        },
        resetData(){
            this.searchObj = {},
            this.fetchData()
        },
        removeDataById(id){        
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                api.removeId(id).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                    }),
                    this.fetchData(this.page,this.limit)
                }).catch(() => {
                    
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        add(){
            this.dialogVisible = true
            this.sysRole = {}
        },
        edit(id){
            this.dialogVisible = true
            api.getRoleID(id).then(response => {
                this.sysRole = response.data;
            })
        },
        saveOrUpdate(){
            if(!this.sysRole.id){
                this.saveRole()
            }else{
                this.updateRole()
            }
        },
        saveRole(){
            api.saveRole(this.sysRole).then(response => {
                this.$message({
                        type: 'success',
                        message: '添加成功!'
                        }),
                this.dialogVisible = false,
                this.fetchData(1,this.limit)
            }).catch(response => {
                this.$message({
                    type: 'error',
                    message: response
                })
            })
        },
        updateRole(){
            api.updataRole(this.sysRole).then(response => {
                this.$message({
                        type: 'success',
                        message: '修改成功!'
                        }),
                this.dialogVisible = false,
                this.fetchData(this.page,this.limit)
            }).catch(response => {
                this.$message({
                    type: 'error',
                    message: response
                })
            })
        },
        batchRemove(){
            if(this.selections.length===0){
                this.$message.warning('请先选择')
                return
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                var ids = []
                for(var i = 0;i<this.selections.length;i++){
                    ids.push(this.selections[i].id)
                }
                api.batchrRemoveId(ids).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                    }),
                    this.fetchData(this.page,this.limit)
                }).catch(() => {
                    
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        showAssignAuth(row) {
            this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
        }
    }
}
</script>