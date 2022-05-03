class CommentLike{
    constructor (){
        this.comment_id=undefined;
        this.by_id=undefined;
    }

    setCommentId(val){
        this.comment_id=val;
        return this;
    }

    setById(val){
        this.by_id=val;
        return this;
    }

    toJson=()=>({
        comment_id:this.comment_id,
        by_id:this.by_id
    })
}

module.exports={
    CommentLike
}