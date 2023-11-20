import request from '@/utils/request'


export default{
    getRadarList(searchModel){
        return request({
            url: '/radar/radardata/listbyCondition',
            method: 'get',
            params:{
                pageNo: searchModel.pageNo,
                pageSize: searchModel.pageSize,
                tgtnumber: searchModel.tgtnumber,
            }
        });
    },
    deletedataById(id){
        return request({
            url: `radar/radardata/delete/${id}`,
            method: 'delete',
        });
    }
}