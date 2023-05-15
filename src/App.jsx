import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { useRef, useState } from "react";
import { Button, Center, Flex, List, ListItem, Text } from "@chakra-ui/react";

import noImage from "./noImage.jpg";

function App() {
  let model = null;
  const inputRef = useRef();
  const imageContainerRef = useRef();
  const [selectedImage, setSelectedImage] = useState();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const prepereImage = async (imageUrl) => {
    const hImage = new Image();
    hImage.src = imageUrl;
    const image = await tf.browser.fromPixels(hImage);
    const resizedImage = await tf.image.resizeBilinear(image, [1024, 1024]);
    return resizedImage;
  };

  const predict = async () => {
    setLoading(true);
    model = await mobilenet.load();
    const i = await prepereImage(selectedImage);
    const p = await model.classify(i);
    setPredictions(p);
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const handleInput = () => {
    inputRef.current.click();
  };

  return (
    <>
      <Flex minW="100vw" h="100vh" justify="center" align="center">
        <Flex
          w="600px"
          direction="column"
          boxShadow="2xl"
          p="2rem"
          rounded="1.5rem"
          bg="gray.50"
          border="1px"
          borderColor="green.400"
        >
          <Text>
            Aplikacja do rozpoznania rodzaju sztućca dla maszyny sortującej
          </Text>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
            ref={inputRef}
          />

          <Center p="2rem">
            <Flex direction="column" gap="1rem">
              <Button
                colorScheme="green"
                variant="solid"
                onClick={handleInput}
                type="button"
              >
                Wybierz zdjęcie
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                onClick={predict}
                type="button"
                isDisabled={!selectedImage}
                isLoading={loading}
              >
                Rozpoznaj
              </Button>
            </Flex>
          </Center>
          {predictions.length > 0 && (
            <Flex direction="column">
              <Text fontSize="2xl" pb="1rem">
                Rozpoznanie
              </Text>

              <List spacing={3}>
                {predictions.map((prediction, index) => (
                  <ListItem
                    key={index}
                    borderBottom="1px"
                    borderColor="green.400"
                    pb="1rem"
                    m="1rem"
                  >
                    {`${prediction.className}: ${Math.round(
                      prediction.probability * 100
                    )}%`}
                  </ListItem>
                ))}
              </List>
            </Flex>
          )}
          <Center p="2rem">
            <Flex
              overflow="hidden"
              rounded="2rem"
              border="1px"
              borderColor="green.400"
            >
              <img
                ref={imageContainerRef}
                src={selectedImage ? selectedImage : noImage}
                style={{ width: "400px", objectFit: "cover" }}
              />
            </Flex>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}

export default App;
