import request from '@/utils/request'


export default{
    getRadarList(searchModel){
        return request({
            url: '/radar/radarperdata/list',
            method: 'get',
            params:{
                pageNo: searchModel.pageNo,
                pageSize: searchModel.pageSize,
                tgtnumber: searchModel.tgtnumber,
                x: searchModel.x,
                y: searchModel.y,
                angle: searchModel.angle,
                height: searchModel.height,
                recordtime: searchModel.recordtime,

            }
        });
    },
    deletedataById(id){
        return request({
            url: `radar/radarperdata/delete/${id}`,
            method: 'delete',
        });
    }
}