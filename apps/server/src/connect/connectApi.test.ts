import { elasticSearchInstitutionData } from "../test/testData/institution";
import { ConnectApi } from "./connectApi";
import {
  TEST_EXAMPLE_A_AGGREGATOR_STRING,
  TEST_EXAMPLE_B_AGGREGATOR_STRING,
  testExampleInstitution,
} from "../test-adapter/constants";
import * as preferences from "../shared/preferences";
import testPreferences from "../../cachedDefaults/testData/testPreferences.json";
import { ComboJobTypes } from "@repo/utils";

const connectApi = new ConnectApi({
  context: {
    aggregator: TEST_EXAMPLE_A_AGGREGATOR_STRING,
    updated: false,
    institution_id: "xxx",
    resolved_user_id: null,
    jobTypes: [ComboJobTypes.TRANSACTIONS],
  },
});

describe("connectApi", () => {
  describe("loadInstitutionByAggregatorId", () => {
    it("returns the institution", async () => {
      const testId = "testId";

      const response = await connectApi.loadInstitutionByAggregatorId(testId);

      expect(response).toEqual({
        code: testId,
        credentials: [],
        guid: testId,
        instructional_data: {},
        logo_url: testExampleInstitution.logo_url,
        name: testExampleInstitution.name,
        aggregator: TEST_EXAMPLE_A_AGGREGATOR_STRING,
        aggregators: undefined,
        supports_oauth: testExampleInstitution.oauth,
        url: testExampleInstitution.url,
      });
    });
  });

  describe("loadInstitutionByUcpId", () => {
    const expectedInstitutionResponse = {
      guid: elasticSearchInstitutionData[TEST_EXAMPLE_B_AGGREGATOR_STRING].id,
      code: elasticSearchInstitutionData[TEST_EXAMPLE_B_AGGREGATOR_STRING].id,
      name: elasticSearchInstitutionData.name,
      url: elasticSearchInstitutionData.url,
      logo_url: elasticSearchInstitutionData.logo,
      instructional_data: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credentials: [] as any[],
      supports_oauth: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      aggregators: undefined as any,
      aggregator: TEST_EXAMPLE_B_AGGREGATOR_STRING,
    };

    it("finds the institution", async () => {
      jest.spyOn(preferences, "getPreferences").mockResolvedValue({
        ...(testPreferences as preferences.Preferences),
        institutionAggregatorVolumeMap: undefined,
        defaultAggregatorVolume: undefined,
        defaultAggregator: TEST_EXAMPLE_B_AGGREGATOR_STRING,
      });

      const institution = await connectApi.loadInstitutionByUcpId("UCP-1234");
      expect(institution).toEqual(expectedInstitutionResponse);
    });
  });
});
