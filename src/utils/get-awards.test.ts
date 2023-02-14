// Cannot find module './get-awards.js' from 'src/utils/get-awards.test.ts'
import { getAwards } from "./get-awards.js";

describe('tests here', () => {
  it('runs a test', () => {
    const result = getAwards("id");
    expect(result).toBeTruthy();
  })
})