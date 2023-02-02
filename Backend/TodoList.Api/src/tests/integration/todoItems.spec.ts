import request from "supertest";
import * as httpStatus from "http-status";
import {getApp} from "../../app";
import {FORBIDDEN_WORDS} from "../../util/constants";

const app = getApp();

describe("TodoItems GET route", () => {
    test("should initially have empty list", async () => {
        const response = await request(app)
            .get("/api/todoItems")
            .expect(httpStatus.OK);
        expect(response.body).toHaveLength(0);
    });
});

const sampleId = "a11a";
describe("TodoItems PUT route", () => {
    test("should update todoItem", async () => {
        const body = {
            id: sampleId,
            description: "test update",
            isCompleted: false,
        };
        await request(app)
            .post("/api/todoItems")
            .send(body)
            .expect(httpStatus.CREATED);

        body.isCompleted = true;
        const response = await request(app)
            .put("/api/todoItems/" + sampleId)
            .send(body)
            .expect(httpStatus.OK);
        expect(response.body).toEqual(body)

        // Delete
        await request(app)
            .delete("/api/todoItems/" + sampleId)
            .expect(httpStatus.NO_CONTENT);
    });

    test("should not update todoItem not found", async () => {
        const body = {
            id: sampleId,
            description: "test update",
            isCompleted: false,
        };

        const response = await request(app)
            .put("/api/todoItems/" + sampleId)
            .send(body)
            .expect(httpStatus.NOT_FOUND);
        expect(response.text).toEqual("TodoItem not found")
    });
});

describe("TodoItems POST route", () => {
    test("should not allow to create an empty todoItem", async () => {
        const response = await request(app)
            .post("/api/todoItems")
            .send({});
        expect(httpStatus.BAD_REQUEST)
        expect(response.text).toEqual("Description is required")
    });

    test("should not allow to create a duplicated todoItem", async () => {
        await request(app)
            .post("/api/todoItems")
            .send({
                id: sampleId,
                description: 'Ziggy BBQ'
            });

        const response = await request(app)
            .post("/api/todoItems")
            .send({
                description: 'Ziggy BBQ'
            });
        expect(httpStatus.BAD_REQUEST)
        expect(response.text).toEqual("Description already exists")

        // Delete
        await request(app)
            .delete("/api/todoItems/" + sampleId)
            .expect(httpStatus.NO_CONTENT);
    });

    FORBIDDEN_WORDS.forEach(word => {
        test(`should not allow to create with ${word} word`, async () => {
            const response = await request(app)
                .post("/api/todoItems")
                .send({
                    description: word,
                });
            expect(httpStatus.BAD_REQUEST);
            expect(response.text).toEqual(`The word "${word}" is forbidden`)
        });
    })

    test("should be able to create a todoItem", async () => {
        await request(app)
            .post("/api/todoItems")
            .send({
                description: "test",
                isCompleted: false,
            })
            .expect(httpStatus.CREATED);

        const response = await request(app)
            .get("/api/todoItems")
            .expect(httpStatus.OK);
        expect(response.body).toHaveLength(1);
    });
});
