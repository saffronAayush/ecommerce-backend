class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    //Search Feature
    search() {
        let keyword = {};
        if (this.queryStr.keyword) {
            keyword = {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            };
            this.query = this.query.find({ ...keyword });
        }

        return this;
    }

    //filter
    filter() {
        const copyQuery = { ...this.queryStr };

        //removing some fields which are not in the filter option
        const removeFields = ["keyword", "limit", "page"];
        removeFields.forEach((el) => delete copyQuery[el]);

        // filter for pricing
        let queryStr = JSON.stringify(copyQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    //pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default ApiFeature;

/*
class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Search Feature
    search() {
        let keyword = {};
        if (this.queryStr.keyword) {
            keyword = {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: 'i'
                }
            };
        }
        
        this.query = this.query.find({ ...keyword });
        return this;
    }

    // Filter Feature
    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove fields from the query string that are not meant for filtering
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);

        // Convert the query copy to a string for advanced filtering
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
}



export default ApiFeature
*/
