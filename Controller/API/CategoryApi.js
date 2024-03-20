const express = require('express')
const Category = require('../../Models/Category')
const app = express()

app.get('api/v1/category', async (req, res) => {
    const category = await Category.find()
    if(!category) return res.json({status: 404, message:"Something is wrong"})
    return res.json(category)
})