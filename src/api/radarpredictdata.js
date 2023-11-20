import request from '@/utils/request'


export default{
    getRadarList(searchModel){
        return request({
            url: '/radar/radarpredictdata/list',
            method: 'get',
            params:{
                pageNo: searchModel.pageNo,
                pageSize: searchModel.pageSize,
                id: searchModel.id,
            }
        });
    },
    deletedataById(id){
        return request({
            url: `radar/radarpredictdata/delete/${id}`,
            method: 'delete',
        });
    }
}