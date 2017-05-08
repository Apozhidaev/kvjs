const assert = require('assert');
const kvjs = require('../index');

describe('kvjs', function () {

    it('toObject', function () {

        // var scheme = {
        //     summary: {
        //         type: "string",
        //         key: "sm"
        //     }
        // };

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

        var t = kvjs.revertScheme(scheme);

        let mapper = kvjs.createMapper(scheme);

        let book = {
            issues: [
                {
                    id: 3,
                    summary: "Test 3",
                    content: {
                        value: "WnF4D8MXUmTnHhJzzFRjnw==",
                        encrypted: true
                    }
                },
                {
                    id: 2,
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

        book.issues.sort((a,b) => a.id - b.id);
        book.issueLinks.sort((a,b) => a.childId - b.childId);

        let keyValues = mapper.toKeyValues(book);

        let book2 = mapper.toObject(keyValues);

        book2.issues.sort((a,b) => a.id - b.id);
        book2.issueLinks.sort((a,b) => a.childId - b.childId);


        assert.deepEqual(book, book2);
    });

});