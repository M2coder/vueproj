import request from '@/utils/request'


export default{
    getUserList(searchModel){
        return request({
            url: '/radar/data/user/list',
            method: 'get',
            params:{
                pageNo: searchModel.pageNo,
                pageSize: searchModel.pageSize,
                username: searchModel.username,
                level: searchModel.level,
                registerTime: searchModel.registerTime,
            }
        });
    },
    addUser(user){
        return request({
            url: '/radar/data/user/adduser',
            method: 'post',
            data: user
        })
    },
    updateUser(user){
        return request({
            url: '/radar/data/user/updateUser',
            method: 'put',
            data: user
        })
    },
    saveUser(user){
        if(user.id==null || user.id==undefined ){
            return this.addUser(user);
        }else{
            return this.updateUser(user);
        }
    },
    getUserById(id){
        return request({
            url: `/radar/data/user/${id}`,
            method: 'get',
        })
    },
    deleteUserById(id){
        return request({
            url: `radar/data/user/delete/${id}`,
            method: 'delete',
        });
    }
}
