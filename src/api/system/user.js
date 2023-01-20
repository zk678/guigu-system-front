import request from '@/utils/request'

const BASE_API = '/admin/system/sysUser'
const api_name = '/admin/system/sysRole'

export default {
    getPageList(page ,limit,searchObj){
        return request({

            // url: '/admin/system/sysRole/'+page+'/'+limit,

            url: `${BASE_API}/${page}/${limit}`,
            method: 'get',
            params: searchObj
          })
    },
    
    save(user){
        return request({
            url: `${BASE_API}/save`,
            method: 'post',
            //json data:
            data: user
        })
    },

    getUserID(id){
        return request({
            url: `${BASE_API}/getuser/${id}`,
            method: 'get',
        })
    },

    update(user){
        return request({
            url: `${BASE_API}/update`,
            method: 'post',
            data: user
        })
    },

    remove(id){
        return request({
            url: `${BASE_API}/remove/${id}`,
            method: 'delete',
        })
    },


    updateStatus(id,status){
        return request({
            url: `${BASE_API}/updateStatus/${id}/${status}`,
            method: 'get'
        })
    },

    
    //根据用户id查询用户已分配的角色
    getRolesByUserId(userId) {
        return request({
        url: `${api_name}/toAssign/${userId}`,
        method: 'get'
        })
    },
    
    //分配角色
    assignRoles(assginRoleVo) {
        return request({
        url: `${api_name}/doAssign`,
        method: 'post',
        data: assginRoleVo
        })
    }
}
