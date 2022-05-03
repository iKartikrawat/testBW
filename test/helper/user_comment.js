class UserComment {
    
    constructor() {
        this.id=undefined;
        this.title = null;
        this.description = null;
        this.mbti = null;
        this.enneagram = null;
        this.zodiac = null;
        this.likes_count=0;
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

    setOnId(val){
        this.on_id=val;
        return this;
    }

    setById(val){
        this.by_id=val;
        return this;
    }
    
    setLikesCount(val){
        this.likes_count=val;
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
        likes_count:this.likes_count
    })

}

module.exports={
    UserComment
}