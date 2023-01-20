import request from '@/utils/request'

const BASE_API = '/admin/system/sysRole'

export default {
    
    getPageList(page,limit,searchObj){
        return request({
            // url: '/admin/system/sysRole/'+page+'/'+limit,
            url: `${BASE_API}/${page}/${limit}`,
            method: 'get',
            params: searchObj
          })
    },
    //删除
    removeId(id){
        return request({
            url: `${BASE_API}/remove/${id}`,
            method: 'delete',
        })
    },

    saveRole(role){
        return request({
            url: `${BASE_API}/save`,
            method: 'post',
            //json data:
            data: role
        })
    },
    //根据id查询
    getRoleID(id){
        return request({
            url: `${BASE_API}/findRoleById/${id}`,
            method: 'post',
        })
    },
    //修改
    updataRole(role){
        return request({
            url: `${BASE_API}/update`,
            method: 'post',
            data: role
        })
    },
    //批量删除
    batchrRemoveId(ids){
        return request({
            url: `${BASE_API}/batchremove`,
            method: 'delete',
            data: ids
        })
    }

}
