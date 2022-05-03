class User {
    constructor() {
        this.id = undefined;
        this.name = undefined;
        this.description = undefined;
        this.mbti = undefined;
        this.enneagram = undefined;
        this.variant = undefined;
        this.tritype = undefined;
        this.socionics = undefined;
        this.sloan = undefined;
        this.psyche = undefined;
        this.image = undefined;
    }

    setId(val){
        this.id=val;
        return this;
    }
    setName(val){
        this.name=val;
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
    setVariant(val){
        this.variant=val;
        return this;
    }
    setTritype(val){
        this.tritype=val;
        return this;
    }
    setSocionics(val){
        this.socionics=val;
        return this;
    }
    setSloan(val){
        this.sloan=val;
        return this;
    }
    setPsyche(val){
        this.psyche=val;
        return this;
    }
    setImage(val){
        this.image=val;
        return this;
    }

    toJson=()=>({
        id :this.id,
        name :this.name,
        description :this.description,
        mbti :this.mbti,
        enneagram :this.enneagram,
        variant :this.variant,
        tritype :this.tritype,
        socionics :this.socionics,
        sloan :this.sloan,
        psyche :this.psyche,
        image :this.image,
    })
}

module.exports={User};