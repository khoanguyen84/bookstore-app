import axios from "axios";
import { CATEGORY_API } from './common';

class CategoryService {
    static getCategories() {
        return axios.get(CATEGORY_API);
    }
}

export default CategoryService;