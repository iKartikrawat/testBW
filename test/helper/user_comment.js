class UserComment {
    
    constructor() {
        this.id=undefined;
        this.title = undefined;
        this.description = undefined;
        this.mbti = undefined;
        this.enneagram = undefined;
        this.zodiac = undefined;
        this.likesCount=0;
        this.on_id=undefined;
        this.by_id=undefined;
    }

    setId(val){
        this.id=val;
        return this;
    }

    setTitle(val){
        this.title=val;
        return this;
    }
    
    setDescription(val){
        this.description=val;
        return this;
    }
    
    setMbti(val){
        this.mbti=val;
        return this;
    }
    
    setEnneagram(val){
        this.enneagram=val;
        return this;
    }
    
    setZodiac(val){
        this.zodiac=val;
        return this;
    }

    setToId(){
        this.on_id=val;
        return this;
    }

    setById(){
        this.by_id=val;
        return this;
    }
    
    setLikesCount(val){
        this.likesCount=val;
        return this;
    }

    toJson=()=>({
        id :this.id,
        title :this.title,
        description :this.description,
        mbti :this.mbti,
        enneagram :this.enneagram,
        zodiac :this.zodiac,
        on_id:this.on_id,
        by_id:this.by_id,
        likesCount:this.likesCount
    })

}

module.exports={
    UserComment
}