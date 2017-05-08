const assert = require('assert');
const {createMapper} = require('../src/index');

describe('kvjs', function () {

    it('toKeyValues', function () {

        var scheme = {
            issues: {
                type: "array",
                key: "i",
                item: {
                    type: "object",
                    id: [{
                        prop: "id",
                        type: "int"
                    }],
                    scheme: {
                        summary: {
                            type: "string",
                            key: "sm"
                        },
                        content: {
                            type: "object",
                            key: "c",
                            scheme: {
                                value: {
                                    type: "string",
                                    key: "val"
                                },
                                encrypted: {
                                    type: "bool",
                                    key: "encpt"
                                }
                            }
                        },
                        archive: {
                            type: "bool",
                            key: "zip"
                        },
                        root: {
                            type: "bool",
                            key: "root"
                        },
                        resources: {
                            type: "array",
                            key: "r",
                            item: {
                                type: "object",
                                scheme: {
                                    url: {
                                        type: "string",
                                        key: "url"
                                    },
                                    description: {
                                        type: "string",
                                        key: "desc"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            issueLinks: {
                type: "array",
                key: "l",
                item: {
                    type: "object",
                    id: [{
                        prop: "parentId",
                        type: "int"
                    },
                    {
                        prop: "childId",
                        type: "int"
                    }],
                    value: "+"
                }
            }
        };


        let mapper = createMapper(scheme);

        let book = {
            issues: [
                {
                    id: 3,
                    creation: "2017-03-18T22:59:41.932Z",
                    summary: "Test 3",
                    content: {
                        value: "WnF4D8MXUmTnHhJzzFRjnw==",
                        encrypted: true
                    }
                },
                {
                    id: 2,
                    creation: "2017-03-18T22:59:23.859Z",
                    summary: "Test 2",
                    content: {
                        value: "content ..."
                    },
                    resources: [
                        {
                            url: "http://test",
                            description: "some url"
                        }
                    ]
                },
                {
                    id: 1,
                    creation: "2017-03-18T22:58:57.437Z",
                    summary: "Test 1",
                    content: {
                        value: "content ..."
                    }
                }
            ],
            issueLinks: [
                {
                    "childId": 3,
                    "parentId": 1
                },
                {
                    "childId": 2,
                    "parentId": 1
                }
            ]
        };

        let keyValues = mapper.toKeyValues(book);


        assert.equal(1, 1);
    });

});